import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
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

  async createUserStylist(dto: CreateStylistDto) {
    const { email, phone, password, gender, fullName } = dto;

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }
    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const role = await this.prisma.role.findUnique({
      where: { name: "STYLIST" },
    });
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.ROLE.NOT_FOUND);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        fullName,
        gender,
        avatar: dto.avatar ?? null,
        password: hashedPassword,
        roleId: role.id,
      },
    });

    return user;
  }

  async createUserManager(dto: CreateManagerDto) {
    const { email, phone, password, fullName } = dto;

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }

    if (phone && (await this.prisma.user.findUnique({ where: { phone } }))) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const role = await this.prisma.role.findUnique({
      where: { name: "MANAGER" },
    });
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.ROLE.NOT_FOUND);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        fullName,
        password: hashedPassword,
        gender: dto.gender ?? null,
        avatar: dto.avatar ?? null,
        roleId: role.id,
      },
    });

    return user;
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
          return this.getListUsersByAdmin({ page, limit, search });
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

  async getListUsersByAdmin({
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
          OR: ["fullName", "email"].map((field) => ({
            [field]: { contains: search },
          })),
        }
      : undefined;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(buildUserResponse),
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
