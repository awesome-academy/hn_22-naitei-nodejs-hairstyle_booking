import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dtos/customer/create-customer.dto";
import { CustomerResponseLoginDto } from "./dtos/customer/auth-customer.dto";
import * as bcrypt from "bcrypt";
import { buildCustomerLoginResponse } from "./utils/response-builder";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { ERROR_MESSAGES } from "../common/constants/error.constants";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createUserCustomer(
    dto: CreateCustomerDto,
  ): Promise<CustomerResponseLoginDto> {
    const { email, phone, password, ...rest } = dto;

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone: phone ?? null,
        password: hashedPassword,
        fullName: rest.fullName ?? "",
        gender: rest.gender ?? null,
        avatar: rest.avatar ?? null,
        role: {
          connect: { name: "CUSTOMER" },
        },
      },
      include: { role: true },
    });

    const customer = await this.customerService.createCustomer({
      userId: user.id,
    });

    return buildCustomerLoginResponse(user, customer);
  }

  async validateCustomer(
    email: string,
    password: string,
  ): Promise<CustomerResponseLoginDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        customer: {
          include: {
            memberTier: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    return buildCustomerLoginResponse(user, user.customer);
  }
}
