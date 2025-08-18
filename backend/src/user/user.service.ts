import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { buildUserResponse } from "./utils/response-builder";
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
import {
  ManagerListResponseDto,
  ManagerResponseDto,
} from "../manager/dtos/manager-response.dto";
import { RoleName } from "../common/enums/role-name.enum";
import { CustomerService } from "../customer/customer.service";
import { StylistService } from "../stylist/stylist.service";
import { ManagerService } from "../manager/manager.service";
import {
  UpdateUserStatusDto,
  UpdateUserStatusResponseDto,
} from "./dtos/user/update-user-status.dto";

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
        return this.stylistService.getListByManager(viewer.id, {
          search,
          limit,
          page,
        });
      }
    }
    throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN_VIEWER_ROLE);
  }

  async getUserDetailByViewer(viewer: JwtPayload, targetUserId: string) {
    if (viewer.role === RoleName.ADMIN) {
      const target = await this.prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true },
      });

      if (!target) throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

      switch (target.role.name) {
        case RoleName.CUSTOMER:
          return this.customerService.getByIdForAdmin(targetUserId);
        case RoleName.STYLIST:
          return this.stylistService.getByIdForAdmin(targetUserId);
        case RoleName.MANAGER:
          return this.managerService.getByIdForAdmin(targetUserId);
        default:
          const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: { role: true },
          });
          if (!user) throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
          return buildUserResponse(user);
      }
    }

    if (viewer.role === RoleName.MANAGER) {
      return this.stylistService.getByIdForManager(viewer.id, targetUserId);
    }

    throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN_VIEWER_ROLE);
  }

  async updateUserStatus(
    currentUser: JwtPayload,
    targetUserId: string,
    dto: UpdateUserStatusDto,
  ): Promise<UpdateUserStatusResponseDto> {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, fullName: true, isActive: true },
    });

    if (!targetUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    if (currentUser.role === "ADMIN") {
      return this.applyStatusChange(targetUserId, dto.isActive);
    }

    if (currentUser.role === "MANAGER") {
      const manager = await this.prisma.manager.findUnique({
        where: { userId: currentUser.id },
        select: { salonId: true },
      });

      if (!manager) {
        throw new ForbiddenException(ERROR_MESSAGES.MANAGER.NOT_FOUND);
      }

      const stylist = await this.prisma.stylist.findFirst({
        where: {
          userId: targetUserId,
          salonId: manager.salonId,
        },
        select: { id: true },
      });

      if (!stylist) {
        throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN_VIEWER_ROLE);
      }

      return this.applyStatusChange(targetUserId, dto.isActive);
    }

    throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN_VIEWER_ROLE);
  }

  private async applyStatusChange(userId: string, isActive: boolean) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, fullName: true, isActive: true },
    });

    return {
      userId: updated.id,
      fullName: updated.fullName,
      isActive: updated.isActive,
    };
  }

  private async getListUsersByAdmin({
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
