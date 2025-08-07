import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerListResponseDto } from "./dtos/customer-response.dto";
import { CustomerResponseDto } from "./dtos/customer-response.dto";
import * as bcrypt from "bcrypt";
import { buildCustomerResponse } from "./utils/customer-response-builder";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { ERROR_MESSAGES } from "../common/constants/error.constants";

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createCustomer(data: { userId: string }) {
    return this.prisma.customer.create({
      data: {
        userId: data.userId,
        totalCompleted: 0,
        totalCancelled: 0,
        totalSpending: 0,
      },
      include: {
        memberTier: true,
      },
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
