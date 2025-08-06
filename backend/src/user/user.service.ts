import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCustomerDto } from "../customer/dtos/create-customer.dto";
import { CreateManagerDto } from "../manager/dtos/create-manager.dto";
import { CreateStylistDto } from "../stylist/dto/create-stylist.dto";
import { ManagerResponseDto } from "../manager/dtos/manager-response.dto";
import * as bcrypt from "bcrypt";
import { buildUserResponse } from "./utils/response-builder";
import { buildManagerResponse } from "../manager/utils/manager-response-builder";
import { buildStylistResponse } from "../stylist/utils/stylist-response-builder";
import { buildCustomerResponse } from "../customer/utils/customer-response-builder";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import {
  CustomerListResponseDto,
  CustomerResponseDto,
} from "../customer/dtos/customer-response.dto";
import {
  StylistListResponseDto,
  StylistResponseDto,
} from "../stylist/dto/stylist-response.dto";
import {
  UserListResponseDto,
  UserResponseDto,
} from "./dtos/user/user-response.dto";
import { ManagerListResponseDto } from "../manager/dtos/manager-response.dto";
import { RoleName } from "../common/enums/role-name.enum";
import { CustomerService } from "../customer/customer.service";
import { StylistService } from "../stylist/stylist.service";
import { ManagerService } from "../manager/manager.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    private readonly stylistService: StylistService,
    private readonly managerService: ManagerService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createUserCustomer(
    dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
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

    return buildCustomerResponse({
      ...customer,
      user,
    });
  }

  async createUserStylist(dto: CreateStylistDto): Promise<StylistResponseDto> {
    const { email, phone, password, salonId, ...rest } = dto;

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const salon = await this.prisma.salon.findUnique({
      where: { id: salonId },
    });
    if (!salon) {
      throw new BadRequestException(ERROR_MESSAGES.SALON.NOT_FOUND);
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
          connect: { name: "STYLIST" },
        },
        stylist: {
          create: {
            salon: {
              connect: { id: salonId },
            },
          },
        },
      },
      include: {
        role: true,
        stylist: {
          include: {
            salon: true,
          },
        },
      },
    });

    return buildStylistResponse({
      ...user.stylist,
      rating: user.stylist?.rating ?? 0,
      ratingCount: user.stylist?.ratingCount ?? 0,
      salonId: user.stylist?.salonId ?? "",
      user,
    });
  }

  public async createUserManager(
    dto: CreateManagerDto,
  ): Promise<ManagerResponseDto> {
    const { email, phone, password, salonId, ...rest } = dto;
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }
    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }
    const salon = await this.prisma.salon.findUnique({
      where: { id: salonId },
    });
    if (!salon) {
      throw new BadRequestException(ERROR_MESSAGES.SALON.NOT_FOUND);
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
        role: { connect: { name: RoleName.MANAGER } },
        manager: { create: { salon: { connect: { id: salonId } } } },
      },
      include: { role: true, manager: { include: { salon: true } } },
    });
    return buildManagerResponse({
      ...user.manager,
      salonId: user.manager?.salonId ?? "",
      user,
    });
  }

  public async validateAdmin(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }
    if (user.role.name !== RoleName.ADMIN) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_ADMIN_ROLE);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }
    const hash = await bcrypt.hash("NewPass@123", 10);
    console.log(`Hashed password: ${hash}`);

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }
    return buildUserResponse(user);
  }

  async findUsersByViewer(
    viewer: JwtPayload,
    role: "CUSTOMER" | "STYLIST" | "MANAGER" | undefined,
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<
    | CustomerListResponseDto
    | StylistListResponseDto
    | ManagerListResponseDto
    | UserListResponseDto
  > {
    if (viewer.role === "ADMIN") {
      switch (role) {
        case "CUSTOMER":
          return this.customerService.getListByAdmin({ page, limit, search });

        case "STYLIST":
          return this.stylistService.getListByAdmin({ page, limit, search });

        case "MANAGER":
          return this.managerService.getListByAdmin({ page, limit, search });

        default:
          return this.getList({ page, limit, search });
      }
    }

    if (viewer.role === "MANAGER") {
      if (!role || role === "STYLIST") {
        return this.stylistService.getStylistsByManager(viewer.id, {
          search,
          limit,
          page,
        });
      }
    }
    throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN_VIEWER_ROLE);
  }

  async getList({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponseDto> {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              fullName: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
          ],
        }
      : undefined;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = users.map((user) => buildUserResponse(user));

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
