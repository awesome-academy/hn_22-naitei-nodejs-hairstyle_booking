import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { GetServicesQueryDto } from "./dto/get-services-query.dto";
import {
  ServiceCreateResponseDto,
  ServiceDeleteResponseDto,
  ServiceListResponseDto,
  ServiceUpdateResponseDto,
} from "./dto/service-response.dto";
import {
  buildServiceCreateResponse,
  buildServiceDeleteResponse,
  buildServiceListResponse,
  buildServiceUpdateResponse,
} from "./utils/service-response-builder";
import { CreateServiceDto } from "src/service/dto/create-service.dto";
import { UpdateServiceDto } from "src/service/dto/update-service.dto";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";

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

  async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceCreateResponseDto> {
    try {
      const service = await this.prisma.service.create({
        data: {
          name: createServiceDto.name,
          description: createServiceDto.description,
          price: createServiceDto.price,
          duration: createServiceDto.duration,
        },
        include: {
          _count: {
            select: {
              bookingServices: true,
            },
          },
        },
      });

      return buildServiceCreateResponse(service);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(ERROR_MESSAGES.SERVICE.ALREADY_EXISTS);
        }
      }
      throw error;
    }
  }

  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceUpdateResponseDto> {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException(ERROR_MESSAGES.SERVICE.NOT_FOUND);
    }

    try {
      const updatedService = await this.prisma.service.update({
        where: { id },
        data: {
          name: updateServiceDto.name,
          description: updateServiceDto.description,
          price: updateServiceDto.price,
          duration: updateServiceDto.duration,
        },
        include: {
          _count: {
            select: {
              bookingServices: true,
            },
          },
        },
      });

      return buildServiceUpdateResponse(updatedService);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(ERROR_MESSAGES.SERVICE.ALREADY_EXISTS);
        }
      }
      throw error;
    }
  }

  async deleteService(id: string): Promise<ServiceDeleteResponseDto> {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookingServices: {
              where: {
                booking: {
                  status: { in: ["PENDING"] },
                },
              },
            },
          },
        },
      },
    });

    if (!existingService) {
      throw new NotFoundException(ERROR_MESSAGES.SERVICE.NOT_FOUND);
    }

    // Chỉ prevent delete nếu có active bookings
    if (existingService._count.bookingServices > 0) {
      throw new ConflictException(ERROR_MESSAGES.SERVICE.HAS_ACTIVE_BOOKINGS);
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return buildServiceDeleteResponse();
  }
}
