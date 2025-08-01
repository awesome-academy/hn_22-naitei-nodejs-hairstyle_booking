import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OtpType } from "./enums/otp-type.enum";

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

  async verifyOtp(userId: string, code: string, type: OtpType): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otp) {
      throw new BadRequestException("OTP không hợp lệ hoặc đã hết hạn");
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    return true;
  }
}