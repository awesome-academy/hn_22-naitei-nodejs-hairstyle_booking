import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { AuthCustomerResponseDto } from "../user/dtos/customer/auth-customer.dto";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { buildCustomerLoginResponse } from "../user/utils/response-builder";
import { OtpService } from "../otp/otp.service";
import { EmailService } from "../email/email.service";
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from "src/auth/dtos/forgot-password.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { OtpType } from "src/otp/enums/otp-type.enum";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async registerCustomer(dto: RegisterDto): Promise<AuthCustomerResponseDto> {
    const customer = await this.userService.createUserCustomer(dto);

    const payload = {
      sub: customer.id,
      email: customer.email,
      role: customer.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      customer,
    };
  }

  async loginCustomer(dto: LoginDto): Promise<AuthCustomerResponseDto> {
    const customer = await this.userService.validateCustomer(
      dto.email,
      dto.password,
    );

    const payload = {
      sub: customer.id,
      email: customer.email,
      role: customer.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      customer,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }

    const otpCode = await this.otpService.createOtp(user.id, OtpType.RESET_PASSWORD);
    
    await this.emailService.sendPasswordResetOtp(dto.email, otpCode);
  }

  async verifyResetOtp(dto: VerifyOtpDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }
    
    await this.otpService.checkOtpValid(user.id, dto.otp, OtpType.RESET_PASSWORD);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }
    
    await this.otpService.verifyOtp(user.id, dto.otp, OtpType.RESET_PASSWORD);
    
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
