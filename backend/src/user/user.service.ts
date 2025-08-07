import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dtos/customer/create-customer.dto";
import { CreateManagerDto } from "./dtos/manager/create-manager.dto";
import { CreateStylistDto } from "./dtos/stylist/create-stylist.dto";
import { ManagerResponseDto } from "./dtos/manager/manager-response.dto";
import * as bcrypt from "bcrypt";
import {
  buildCustomerResponse,
  buildStylistResponse,
  buildManagerResponse,
  buildUserResponse,
} from "./utils/response-builder";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import {
  ListCustomerResponseDto,
  CustomerResponseDto,
} from "./dtos/customer/customer-response.dto";
import {
  ListStylistResponseDto,
  StylistResponseDto,
} from "./dtos/stylist/stylist-response.dto";
import {
  ListUserResponseDto,
  UserResponseDto,
} from "./dtos/user/user-response.dto";
import { ListManagerResponseDto } from "./dtos/manager/manager-response.dto";
import {
  getAllUsers,
  getCustomers,
  getStylists,
  getManagers,
} from "./utils/list-users.helper";
import { RoleName } from "../common/enums/role-name.enum";
import { UpdateUserDto } from "./dtos/user/update-user.dto";
import { ChangePasswordDto } from "./dtos/user/change-password.dto";

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

    return buildCustomerResponse(user, customer);
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

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    return buildCustomerResponse(user, user.customer);
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

    return buildStylistResponse(user, user.stylist);
  }

  async validateStylist(
    email: string,
    password: string,
  ): Promise<StylistResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        stylist: {
          include: {
            salon: true,
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

    return buildStylistResponse(user, user.stylist);
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
    return buildManagerResponse(user, user.manager);
  }

  public async validateManager(
    email: string,
    password: string,
  ): Promise<ManagerResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, manager: { include: { salon: true } } },
    });
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }
    if (user.role.name !== RoleName.MANAGER) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_MANAGER_ROLE);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }
    return buildManagerResponse(user, user.manager);
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
    user: JwtPayload,
    role?: "CUSTOMER" | "STYLIST" | "MANAGER",
    page = 1,
    limit = 20,
  ): Promise<
    | ListCustomerResponseDto
    | ListStylistResponseDto
    | ListManagerResponseDto
    | ListUserResponseDto
  > {
    const skip = (page - 1) * limit;
    const viewerRole = user.role;

    if (viewerRole === "ADMIN") {
      switch (role) {
        case "CUSTOMER":
          return getCustomers(this.prisma);
        case "STYLIST":
          return getStylists(this.prisma);
        case "MANAGER":
          return getManagers(this.prisma);
        default:
          return getAllUsers(this.prisma);
      }
    }

    if (viewerRole === "MANAGER") {
      if (!role || role === "STYLIST") {
        const manager = await this.prisma.manager.findUnique({
          where: { userId: user.id },
          select: { salonId: true },
        });

        if (!manager) throw new Error(ERROR_MESSAGES.MANAGER.NOT_FOUND);

        const [stylists, total] = await Promise.all([
          this.prisma.stylist.findMany({
            where: { salonId: manager.salonId },
            skip,
            take: limit,
            include: {
              user: { include: { role: true } },
              salon: true,
            },
          }),
          this.prisma.stylist.count({
            where: { salonId: manager.salonId },
          }),
        ]);

        return {
          data: stylists.map((s) =>
            buildStylistResponse(s.user, {
              salonId: s.salon.id,
              rating: s.rating,
              ratingCount: s.ratingCount,
            }),
          ),
          total,
          page,
          limit,
        };
      } else {
        throw new ForbiddenException(
          ERROR_MESSAGES.ROLE.NOT_ALLOWED_FOR_MANAGER,
        );
      }
    } else {
      throw new ForbiddenException(ERROR_MESSAGES.ROLE.YOU_ARE_NOT_ADMIN);
    }
  }
}
