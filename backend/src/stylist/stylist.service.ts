import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { GetStylistsQueryDto } from "./dto/get-stylists-query.dto";
import { CreateStylistDto } from "./dto/create-stylist.dto";
import { StylistListResponseDto } from "./dto/stylist-response.dto";
import { buildStylistResponse } from "./utils/stylist-response-builder";
import { buildStylistListResponse } from "./utils/stylist-response-builder";
import { StylistResponseDto } from "./dto/stylist-response.dto";
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class StylistService {
  constructor(private readonly prisma: PrismaService) {}

  async createStylist(
    currentUser: JwtPayload,
    dto: CreateStylistDto,
  ): Promise<StylistResponseDto> {
    const manager = await this.prisma.manager.findUnique({
      where: { userId: currentUser.id },
      select: { salonId: true },
    });
    if (!manager) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.MANAGER_NOT_FOUND);
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

    const role = await this.prisma.role.findUnique({
      where: { name: "STYLIST" },
    });
    if (!role) throw new NotFoundException(ERROR_MESSAGES.ROLE.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone ?? null,
        fullName: dto.fullName,
        gender: dto.gender ?? null,
        avatar: dto.avatar ?? null,
        password: hashedPassword,
        roleId: role.id,
      },
    });

    const stylist = await this.prisma.stylist.create({
      data: {
        userId: user.id,
        salonId: manager.salonId,
      },
      include: {
        user: { include: { role: true } },
        salon: true,
      },
    });

    return buildStylistResponse(stylist);
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
          include: { salon: true },
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

    if (!user.stylist) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.STYLIST_NOT_FOUND);
    }

    return buildStylistResponse({
      rating: user.stylist.rating,
      ratingCount: user.stylist.ratingCount,
      salon: {
        id: user.stylist.salonId,
        name: user.stylist.salon.name,
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
        },
      },
    });
  }

  async getStylistsByCustomer(
    query: GetStylistsQueryDto,
  ): Promise<StylistListResponseDto> {
    const { search, salonId, minRating, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StylistWhereInput = {};

    if (search) {
      where.user = {
        fullName: {
          contains: search,
        },
      };
    }

    if (salonId) {
      where.salonId = salonId;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }
    const [stylists, total] = await Promise.all([
      this.prisma.stylist.findMany({
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
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ rating: "desc" }, { ratingCount: "desc" }],
      }),
      this.prisma.stylist.count({ where }),
    ]);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    };

    return buildStylistListResponse(stylists, pagination);
  }

  async getListByAdmin({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<StylistListResponseDto> {
    const skip = (page - 1) * limit;

    const where = {
      user: search
        ? {
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
          }
        : undefined,
    };

    const [stylists, total] = await Promise.all([
      this.prisma.stylist.findMany({
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
          salon: { select: { id: true, name: true } },
        },
        orderBy: [
          { rating: "desc" },
          { ratingCount: "desc" },
          { createdAt: "desc" },
        ],
      }),
      this.prisma.stylist.count({ where }),
    ]);

    const data = stylists.map(buildStylistResponse);
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

  async getStylistsByManager(
    managerId: string,
    query: { search?: string; page?: number; limit?: number },
  ): Promise<StylistListResponseDto> {
    const manager = await this.prisma.manager.findUnique({
      where: { userId: managerId },
      select: { salonId: true },
    });

    if (!manager) {
      throw new Error(ERROR_MESSAGES.AUTH.MANAGER_NOT_FOUND);
    }

    const { search = "", limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const whereCondition = {
      salonId: manager.salonId,
      user: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    };

    const [stylists, total] = await Promise.all([
      this.prisma.stylist.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
          user: { include: { role: true } },
          salon: true,
        },
      }),
      this.prisma.stylist.count({ where: whereCondition }),
    ]);

    return {
      data: stylists.map((stylist) => buildStylistResponse(stylist)),
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
