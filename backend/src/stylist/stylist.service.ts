import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { GetStylistsQueryDto } from "./dto/get-stylists-query.dto";
import { StylistListResponseDto } from "./dto/stylist-response.dto";
import { buildStylistListResponse } from "./utils/stylist-response-builder";

@Injectable()
export class StylistService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStylists(
    query: GetStylistsQueryDto,
  ): Promise<StylistListResponseDto> {
    const { search, salonId, minRating, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const conditions: Prisma.StylistWhereInput[] = [];

    if (search) {
      conditions.push({
        user: {
          fullName: {
            contains: search,
            mode: "insensitive",
          } as Prisma.StringNullableFilter,
        },
      });
    }

    if (salonId) {
      conditions.push({ salonId });
    }

    if (minRating !== undefined) {
      conditions.push({ rating: { gte: minRating } });
    }

    const where: Prisma.StylistWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

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
              avatar: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
              favoritedBy: true,
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
}
