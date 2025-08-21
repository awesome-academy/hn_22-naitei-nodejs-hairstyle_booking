import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { buildManagerResponse } from "./utils/manager-response-builder";
import { CreateManagerDto } from "./dtos/create-manager.dto";
import { ManagerResponseDto } from "./dtos/manager-response.dto";
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { RoleName } from "../common/enums/role-name.enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService) {}

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

    if (await this.prisma.user.findUnique({ where: { email: dto.email } })) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }
    if (
      dto.phone &&
      (await this.prisma.user.findUnique({ where: { phone: dto.phone } }))
    ) {
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const role = await this.prisma.role.findUnique({
      where: { name: "MANAGER" },
    });
    if (!role) throw new NotFoundException(ERROR_MESSAGES.ROLE.NOT_FOUND);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone ?? null,
        fullName: dto.fullName,
        password: hashedPassword,
        gender: dto.gender ?? null,
        avatar: dto.avatar ?? null,
        roleId: role.id,
      },
    });

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

    if (user.role.name !== RoleName.MANAGER.toString()) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_MANAGER_ROLE);
    }

    if (!user.manager) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.MANAGER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    return buildManagerResponse({
      ...user.manager,
      salon: user.manager.salon,
      user,
    });
  }

  async getByIdForAdmin(id: string): Promise<ManagerResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        manager: { include: { salon: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    if (!user.manager) {
      throw new NotFoundException(ERROR_MESSAGES.MANAGER.NOT_FOUND);
    }

    return buildManagerResponse({
      ...user.manager,
      salon: user.manager.salon,
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
