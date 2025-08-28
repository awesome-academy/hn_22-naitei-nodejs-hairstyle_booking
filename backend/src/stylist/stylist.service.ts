import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { GetStylistsQueryDto } from "./dto/get-stylists-query.dto";
import { CreateStylistDto } from "./dto/create-stylist.dto";
import {
  StylistListResponseDto,
  StylistWithFavouriteResponseDto,
} from "./dto/stylist-response.dto";
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
import { bootstrapWorkScheduleForStylist } from "./utils/bootstrap-workschedule";

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

    await bootstrapWorkScheduleForStylist(this.prisma, stylist.id);

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
        stylist: { include: { salon: true } },
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
      ...user.stylist,
      salon: user.stylist.salon,
      user,
    });
  }

  async getByIdForAdmin(id: string): Promise<StylistResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        stylist: { include: { salon: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    if (!user.stylist) {
      throw new NotFoundException(ERROR_MESSAGES.STYLIST.NOT_FOUND);
    }

    return buildStylistResponse({
      ...user.stylist,
      salon: user.stylist.salon,
      user,
    });
  }

  async getByIdForManager(
    viewerUserId: string,
    targetUserId: string,
  ): Promise<StylistResponseDto> {
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: targetUserId },
      include: { salon: true, user: { include: { role: true } } },
    });

    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.STYLIST.NOT_FOUND);
    }

    const manager = await this.prisma.manager.findUnique({
      where: { userId: viewerUserId },
      select: { salonId: true },
    });

    if (!manager) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_MANAGER_ROLE);
    }

    if (stylist.salonId !== manager.salonId) {
      throw new ForbiddenException(
        "Managers can only view stylists in their own salon",
      );
    }

    return buildStylistResponse({
      ...stylist,
      salon: stylist.salon,
      user: stylist.user,
    });
  }

  async getListByCustomer(
    query: GetStylistsQueryDto,
    userId?: string | null,
  ): Promise<StylistListResponseDto> {
    let customerId: string | null = null;

    if (userId) {
      const customer = await this.prisma.customer.findUnique({
        where: { userId },
      });
      if (customer) {
        customerId = customer.id;
      }
    } else {
      console.log("error");
    }

    const { search, salonId, minRating, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StylistWhereInput = {};
    if (search) where.user = { fullName: { contains: search } };
    if (salonId) where.salonId = salonId;
    if (minRating !== undefined) where.rating = { gte: minRating };

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
          favoritedBy: customerId
            ? {
                where: { customerId },
                select: { id: true },
              }
            : false, // nếu chưa login thì không join
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

    const data: StylistWithFavouriteResponseDto[] = stylists.map((s) => ({
      ...s.user,
      rating: s.rating,
      ratingCount: s.ratingCount,
      salon: s.salon,
      favourite: customerId ? s.favoritedBy.length > 0 : false,
    }));

    if (customerId) {
      data.sort((a, b) => {
        if (a.favourite === b.favourite) return 0;
        return a.favourite ? -1 : 1;
      });
    }

    return { data, pagination };
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

  async getListByManager(
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

    const baseWhere = {
      salonId: manager.salonId,
    };

    let allStylists = await this.prisma.stylist.findMany({
      where: baseWhere,
      include: {
        user: { include: { role: true } },
        salon: true,
      },
      orderBy: [
        { rating: "desc" },
        { ratingCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      console.log("🔍 Manager stylist search with JS toLowerCase:", {
        managerId,
        originalSearch: search.trim(),
        searchTerm,
        totalStylists: allStylists.length,
      });

      allStylists = allStylists.filter((stylist) => {
        const fullName = stylist.user.fullName?.toLowerCase() || "";
        const email = stylist.user.email?.toLowerCase() || "";

        return fullName.includes(searchTerm) || email.includes(searchTerm);
      });
    }

    const total = allStylists.length;
    const stylists = allStylists.slice(skip, skip + limit);

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
