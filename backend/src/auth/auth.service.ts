import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { AuthCustomerResponseDto } from "../user/dtos/customer/auth-customer.dto";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { buildCustomerLoginResponse } from "../user/utils/response-builder";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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
}
