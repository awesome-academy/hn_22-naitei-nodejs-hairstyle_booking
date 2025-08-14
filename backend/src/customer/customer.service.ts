import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerListResponseDto } from "./dtos/customer-response.dto";
import { CreateCustomerDto } from "./dtos/create-customer.dto";
import { CustomerResponseDto } from "./dtos/customer-response.dto";
import * as bcrypt from "bcrypt";
import { buildCustomerResponse } from "./utils/customer-response-builder";
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ERROR_MESSAGES } from "../common/constants/error.constants";

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(dto: CreateCustomerDto) {
    const { email, phone, password, fullName, gender, avatar } = dto;

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }
    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await this.prisma.role.findUnique({
      where: { name: "CUSTOMER" },
    });
    if (!role) throw new NotFoundException(ERROR_MESSAGES.ROLE.NOT_FOUND);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone: phone ?? null,
        password: hashedPassword,
        fullName: fullName ?? "",
        gender: gender ?? null,
        avatar: avatar ?? null,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    const customer = await this.prisma.customer.create({
      data: {
        userId: user.id,
        totalCompleted: 0,
        totalCancelled: 0,
        totalSpending: 0,
      },
      include: {
        memberTier: true,
      },
    });

    return buildCustomerResponse({
      ...customer,
      user,
    });
  }

  async validateCustomer(
    email: string,
    password: string,
  ): Promise<CustomerResponseDto> {
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

    if (!user.customer) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.CUSTOMER_NOT_FOUND);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    return buildCustomerResponse({
      ...user.customer,
      totalCompleted: user.customer?.totalCompleted ?? 0,
      totalCancelled: user.customer?.totalCancelled ?? 0,
      totalSpending: user.customer?.totalSpending ?? 0,
      user,
    });
  }

  async getListByAdmin({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CustomerListResponseDto> {
    const skip = (page - 1) * limit;
    const userFilter = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "default" } },
            { email: { contains: search, mode: "default" } },
          ],
        }
      : undefined;

    const where = { user: userFilter };

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { include: { role: true } },
          memberTier: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.customer.count({ where }),
    ]);

    const data = customers.map(buildCustomerResponse);

    return {
      data,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
