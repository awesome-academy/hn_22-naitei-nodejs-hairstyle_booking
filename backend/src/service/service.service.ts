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

    const where: Prisma.ServiceWhereInput = {};

    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: searchLower } },
        { description: { contains: searchLower } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (maxDuration !== undefined) {
      where.duration = { lte: maxDuration };
    }

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
