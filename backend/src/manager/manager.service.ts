import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { buildManagerResponse } from "./utils/manager-response-builder";
import { CreateManagerDto } from "./dtos/create-manager.dto";
import { ManagerResponseDto } from "./dtos/manager-response.dto";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { RoleName } from "../common/enums/role-name.enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class ManagerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createManager(
    currentUser: JwtPayload,
    dto: CreateManagerDto,
  ): Promise<ManagerResponseDto> {
    const admin = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { role: true },
    });

    if (!admin || admin.role.name !== RoleName.ADMIN) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_ADMIN_ROLE);
    }

    const salon = await this.prisma.salon.findUnique({
      where: { id: dto.salonId },
    });

    if (!salon) {
      throw new NotFoundException(ERROR_MESSAGES.SALON.NOT_FOUND);
    }

    const user = await this.userService.createUserManager(dto);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const manager = await this.prisma.manager.create({
      data: {
        userId: user.id,
        salonId: dto.salonId,
      },
      include: {
        user: { include: { role: true } },
        salon: true,
      },
    });

    return buildManagerResponse(manager);
  }

  public async validateManager(
    email: string,
    password: string,
  ): Promise<ManagerResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        manager: { include: { salon: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.USER_INACTIVE);
    }
    if (user.role.name !== RoleName.MANAGER) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_MANAGER_ROLE);
    }
    if (!user.manager) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.MANAGER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    const { manager } = user;

    return buildManagerResponse({
      salon: {
        id: manager.salon.id,
        name: manager.salon.name,
      },
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          name: user.role.name,
          description: user.role.description ?? undefined,
        },
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
  }) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          user: {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "default",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "default",
                },
              },
            ],
          },
        }
      : {};

    const [managers, total] = await Promise.all([
      this.prisma.manager.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatar: true,
              gender: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
              role: { select: { name: true } },
            },
          },
          salon: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.manager.count({ where }),
    ]);

    const data = managers.map((manager) => buildManagerResponse(manager));

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
