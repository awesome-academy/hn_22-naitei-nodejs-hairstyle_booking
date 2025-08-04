import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OtpType } from "./enums/otp-type.enum";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(userId: string, type: OtpType): Promise<string> {
    await this.prisma.otp.deleteMany({
      where: {
        userId,
        type,
        isUsed: false,
      },
    });

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        userId,
        code,
        type,
        expiresAt,
      },
    });

    return code;
  }

  private generateResetToken(): string {
    return uuidv4();
  }

  async verifyOtpAndCreateResetToken(
    userId: string, 
    code: string, 
    type: OtpType
  ): Promise<{ resetToken: string; expiresAt: Date }> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otp) {
      throw new BadRequestException(ERROR_MESSAGES.OTP.INVALID_OR_EXPIRED);
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    const resetToken = this.generateResetToken();
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        userId,
        code: resetToken,
        type: "RESET_TOKEN" as OtpType,
        expiresAt: tokenExpiresAt,
      },
    });

    return { resetToken, expiresAt: tokenExpiresAt };
  }

  async verifyResetToken(userId: string, resetToken: string): Promise<boolean> {
    const token = await this.prisma.otp.findFirst({
      where: {
        userId,
        code: resetToken,
        type: "RESET_TOKEN" as OtpType,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!token) {
      throw new BadRequestException("Reset token is invalid or expired");
    }

    await this.prisma.otp.update({
      where: { id: token.id },
      data: { isUsed: true },
    });

    return true;
  }
}
