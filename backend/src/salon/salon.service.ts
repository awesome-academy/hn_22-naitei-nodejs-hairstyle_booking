import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetSalonsQueryDto } from "./dto/get-salons-query.dto";
import { SalonListResponseDto } from "./dto/salon-response.dto";
import { buildSalonListResponse } from "./utils/salon-response-builder";

@Injectable()
export class SalonService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSalons(query: GetSalonsQueryDto): Promise<SalonListResponseDto> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search.toLowerCase() } },
            { address: { contains: search.toLowerCase() } },
          ],
        }
      : {};

    const [salons, total] = await Promise.all([
      this.prisma.salon.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              stylists: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.salon.count({ where }),
    ]);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    };

    return buildSalonListResponse(salons, pagination);
  }
}
