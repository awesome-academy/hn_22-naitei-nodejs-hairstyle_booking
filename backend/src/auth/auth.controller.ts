import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { Public } from "../common/decorators/public.decorator";
import { AuthCustomerResponseDto } from "../user/dtos/customer/auth-customer.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthStylistResponseDto } from "src/user/dtos/stylist/auth-stylist.dto";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from "src/auth/dtos/forgot-password.dto";
import { ManagerResponseLoginDto } from "src/user/dtos/manager/auth-manager.dto";
import { UserResponseLoginDto } from "src/user/dtos/user/user-response-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async registerCustomer(
    @Body() dto: RegisterDto,
  ): Promise<AuthCustomerResponseDto> {
    return this.authService.registerCustomer(dto);
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto): Promise<AuthCustomerResponseDto | AuthStylistResponseDto | ManagerResponseLoginDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Post("login/admin") 
  async loginAdmin(
    @Body() dto: LoginDto,
  ): Promise<{ access_token: string; admin: UserResponseLoginDto; }> {
    return this.authService.loginAdmin(dto);
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto);
    return { message: "OTP code has been sent to your email" };
  }

  @Public()
  @Post("verify-reset-otp")
  async verifyResetOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<VerifyOtpResponseDto> {
    return this.authService.verifyResetOtp(dto);
  }

  @Public()
  @Post("reset-password")
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPasswordWithToken(dto);
  }
}
