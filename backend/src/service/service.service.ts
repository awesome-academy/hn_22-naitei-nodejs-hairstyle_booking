import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { GetServicesQueryDto } from "./dto/get-services-query.dto";
import { ServiceListResponseDto } from "./dto/service-response.dto";
import { buildServiceListResponse } from "./utils/service-response-builder";

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServices(
    query: GetServicesQueryDto,
  ): Promise<ServiceListResponseDto> {
    const {
      search,
      minPrice,
      maxPrice,
      maxDuration,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    const conditions: Prisma.ServiceWhereInput[] = [];

    if (search) {
      conditions.push({
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            } as Prisma.StringNullableFilter,
          },
        ],
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceCondition: Prisma.IntFilter = {};
      if (minPrice !== undefined) priceCondition.gte = minPrice;
      if (maxPrice !== undefined) priceCondition.lte = maxPrice;
      conditions.push({ price: priceCondition });
    }

    if (maxDuration !== undefined) {
      conditions.push({ duration: { lte: maxDuration } });
    }

    const where: Prisma.ServiceWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              bookingServices: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    };

    return buildServiceListResponse(services, pagination);
  }
}
