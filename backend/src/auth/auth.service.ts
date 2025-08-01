import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { AuthCustomerResponseDto } from "../user/dtos/customer/auth-customer.dto";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { buildCustomerLoginResponse } from "../user/utils/response-builder";
import { OtpService } from "../otp/otp.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException("Email không tồn tại trong hệ thống");
    }

    if (!user.isActive) {
      throw new BadRequestException("Tài khoản đã bị khóa");
    }

    const otpCode = await this.otpService.createOtp(user.id, OtpType.RESET_PASSWORD);
    
    await this.emailService.sendPasswordResetOtp(dto.email, otpCode);

    return { message: "Mã OTP đã được gửi đến email của bạn" };
  }
}
