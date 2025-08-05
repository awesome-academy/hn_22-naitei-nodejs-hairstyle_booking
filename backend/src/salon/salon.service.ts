import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { GetSalonsQueryDto } from "./dto/get-salons-query.dto";
import {
  SalonListResponseDto,
  SalonCreateResponseDto,
  SalonUpdateResponseDto,
  SalonDeleteResponseDto,
} from "./dto/salon-response.dto";
import {
  buildSalonListResponse,
  buildSalonCreateResponse,
  buildSalonUpdateResponse,
  buildSalonDeleteResponse,
} from "./utils/salon-response-builder";
import { CreateSalonDto } from "src/salon/dto/create-salon.dto";
import { UpdateSalonDto } from "src/salon/dto/update-salon.dto";

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

  async createSalon(
    createSalonDto: CreateSalonDto,
  ): Promise<SalonCreateResponseDto> {
    try {
      const salon = await this.prisma.salon.create({
        data: {
          name: createSalonDto.name,
          address: createSalonDto.address,
          avatar: createSalonDto.avatar,
          phone: createSalonDto.phone,
        },
        include: {
          _count: {
            select: {
              stylists: true,
              bookings: true,
            },
          },
        },
      });

      return buildSalonCreateResponse(salon);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            "Salon with this information already exists",
          );
        }
      }
      throw error;
    }
  }

  async updateSalon(
    id: string,
    updateSalonDto: UpdateSalonDto,
  ): Promise<SalonUpdateResponseDto> {
    const existingSalon = await this.prisma.salon.findUnique({
      where: { id },
    });

    if (!existingSalon) {
      throw new NotFoundException("Salon not found");
    }

    try {
      const updatedSalon = await this.prisma.salon.update({
        where: { id },
        data: {
          name: updateSalonDto.name,
          address: updateSalonDto.address,
          avatar: updateSalonDto.avatar,
          phone: updateSalonDto.phone,
        },
        include: {
          _count: {
            select: {
              stylists: true,
              bookings: true,
            },
          },
        },
      });

      return buildSalonUpdateResponse(updatedSalon);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            "Salon with this information already exists",
          );
        }
      }
      throw error;
    }
  }

  async deleteSalon(id: string): Promise<SalonDeleteResponseDto> {
    const existingSalon = await this.prisma.salon.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            stylists: true,
            bookings: {
              where: {
                status: { in: ["PENDING"] },
              },
            },
          },
        },
      },
    });

    if (!existingSalon) {
      throw new NotFoundException("Salon not found");
    }

    // Chỉ prevent delete nếu có active bookings
    if (existingSalon._count.bookings > 0) {
      throw new ConflictException(
        "Cannot delete salon with active bookings. Please complete or cancel all pending bookings first.",
      );
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.stylist.updateMany({
        where: { salonId: id },
        data: {
          salonId: undefined,
        },
      });

      // Delete salon
      await prisma.salon.delete({
        where: { id },
      });
    });

    return buildSalonDeleteResponse();
  }
}
