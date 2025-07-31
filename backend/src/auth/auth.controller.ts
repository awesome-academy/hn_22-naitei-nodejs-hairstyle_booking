import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { Public } from "../common/decorators/public.decorator";
import { AuthCustomerResponseDto } from "../user/dtos/customer/auth-customer.dto";
import { LoginDto } from "./dtos/login.dto";

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
  async loginCustomer(@Body() dto: LoginDto): Promise<AuthCustomerResponseDto> {
    return this.authService.loginCustomer(dto);
  }
}
