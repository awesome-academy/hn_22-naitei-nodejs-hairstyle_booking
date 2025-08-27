import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";
import { RoleName } from "src/common/enums/role-name.enum";

import { DayOffResponseDto } from "./dtos/day-off-response.dto";
import { CreateDayOffDto } from "./dtos/create-day-off.dto";
import { UpdateDayOffStatusDto } from "./dtos/update-day-off-status.dto";

import { DayOff, DayOffStatus as PrismaDayOffStatus } from "@prisma/client";
import { DayOffStatus } from "src/common/enums/day-off-status.enum";

import { startOfDay, endOfDay } from "date-fns";

import { BookingStatus } from "src/common/enums/booking-status.enum";

type DayOffWithStylist = DayOff & {
  stylist?: {
    user?: {
      fullName: string;
    };
  };
};

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDayOffResponseDto(dayOff: DayOffWithStylist): DayOffResponseDto {
    if (!dayOff.stylist?.user?.fullName) {
      throw new Error("Stylist fullName is missing");
    }
    return {
      id: dayOff.id,
      stylistId: dayOff.stylistId,
      stylistName: dayOff.stylist.user.fullName,
      salonId: dayOff.salonId,
      date: dayOff.date,
      reason: dayOff.reason ?? undefined,
      status: dayOff.status as DayOffStatus,
      createdAt: dayOff.createdAt,
      updatedAt: dayOff.updatedAt,
    };
  }

  async createDayOffRequest(
    userId: string,
    userRole: string,
    dto: CreateDayOffDto,
  ): Promise<DayOffResponseDto> {
    if (userRole !== RoleName.STYLIST) {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_STYLIST);
    }
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: userId },
      select: { id: true, salonId: true },
    });
    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    const requestDate = startOfDay(new Date(dto.date));

    if (requestDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new BadRequestException(
        ERROR_MESSAGES.DAY_OFF.PAST_DATE_NOT_ALLOWED,
      );
    }

    const existingDayOff = await this.prisma.dayOff.findFirst({
      where: {
        stylistId: stylist.id,
        date: requestDate,
        status: {
          notIn: [PrismaDayOffStatus.REJECTED, PrismaDayOffStatus.CANCELLED],
        },
      },
    });

    if (existingDayOff) {
      throw new ConflictException(ERROR_MESSAGES.DAY_OFF.DATE_CONFLICT);
    }

    const dayOff = await this.prisma.dayOff.create({
      data: {
        stylistId: stylist.id,
        salonId: stylist.salonId,
        date: requestDate,
        reason: dto.reason ?? null,
        status: PrismaDayOffStatus.PENDING,
      },
      include: { stylist: { include: { user: true } } },
    });
    return this.mapToDayOffResponseDto(dayOff);
  }

  async cancelDayOffRequest(
    userId: string,
    userRole: string,
    dayOffId: string,
  ): Promise<{ message: string }> {
    if (userRole !== RoleName.STYLIST) {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_STYLIST);
    }
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: userId },
      select: { id: true },
    });
    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    const dayOffToCancel = await this.prisma.dayOff.findUnique({
      where: { id: dayOffId },
      include: { stylist: { include: { user: true } } },
    });

    if (!dayOffToCancel) {
      throw new NotFoundException(ERROR_MESSAGES.DAY_OFF.NOT_FOUND);
    }
    if (dayOffToCancel.stylistId !== stylist.id) {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_OWNER);
    }

    if (dayOffToCancel.status !== PrismaDayOffStatus.PENDING) {
      throw new BadRequestException(
        ERROR_MESSAGES.DAY_OFF.ALREADY_APPROVED_OR_REJECTED,
      );
    }

    try {
      await this.prisma.dayOff.update({
        where: { id: dayOffId },
        data: { status: PrismaDayOffStatus.CANCELLED },
      });
      return { message: ERROR_MESSAGES.DAY_OFF.CANCEL_SUCCESS };
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.DAY_OFF.CANCELLATION_FAILED);
    }
  }

  async getDayOffRequests(
    userId: string,
    userRole: string,
  ): Promise<DayOffResponseDto[]> {
    let whereClause: any = {};

    if (userRole === RoleName.STYLIST) {
      const stylist = await this.prisma.stylist.findUnique({
        where: { userId: userId },
        select: { id: true },
      });
      if (!stylist) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
      }
      whereClause = { stylistId: stylist.id };
    } else if (userRole === RoleName.MANAGER) {
      const manager = await this.prisma.manager.findUnique({
        where: { userId: userId },
        select: { salonId: true },
      });
      if (!manager) {
        throw new ForbiddenException(ERROR_MESSAGES.MANAGER.NOT_FOUND);
      }
      whereClause = { salonId: manager.salonId };
    } else if (userRole === RoleName.ADMIN) {
    } else {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_OWNER);
    }

    const dayOffRequests = await this.prisma.dayOff.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      include: { stylist: { include: { user: true } } },
    });
    return dayOffRequests.map(this.mapToDayOffResponseDto);
  }

  async approveOrRejectDayOffRequest(
    managerUserId: string,
    managerUserRole: string,
    dayOffId: string,
    dto: UpdateDayOffStatusDto,
  ): Promise<DayOffResponseDto> {
    if (
      managerUserRole !== RoleName.MANAGER &&
      managerUserRole !== RoleName.ADMIN
    ) {
      throw new ForbiddenException(
        ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST,
      );
    }

    const dayOff = await this.prisma.dayOff.findUnique({
      where: { id: dayOffId },
      include: { stylist: { include: { user: true } } },
    });
    if (!dayOff) {
      throw new NotFoundException(ERROR_MESSAGES.DAY_OFF.NOT_FOUND);
    }

    if (dayOff.status !== PrismaDayOffStatus.PENDING) {
      throw new BadRequestException(
        ERROR_MESSAGES.DAY_OFF.INVALID_STATUS_UPDATE,
      );
    }

    if (managerUserRole === RoleName.MANAGER) {
      const manager = await this.prisma.manager.findUnique({
        where: { userId: managerUserId },
        select: { salonId: true },
      });
      if (!manager) {
        throw new ForbiddenException(
          ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST,
        );
      }
      if (dayOff.stylist.salonId !== manager.salonId) {
        throw new ForbiddenException(
          ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST,
        );
      }
    }

    const updatedDayOff = await this.prisma.dayOff.update({
      where: { id: dayOffId },
      data: { status: dto.status },
      include: { stylist: { include: { user: true } } },
    });

    if (dto.status === DayOffStatus.APPROVED) {
      const dayStart = startOfDay(dayOff.date);
      const dayEnd = endOfDay(dayOff.date);

      await this.prisma.workSchedule.updateMany({
        where: {
          stylistId: dayOff.stylistId,
          workingDate: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        data: { isDayOff: true },
      });

      await this.prisma.booking.updateMany({
        where: {
          stylistId: dayOff.stylistId,
          workSchedule: {
            workingDate: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
          status: BookingStatus.PENDING,
        },
        data: { status: BookingStatus.CANCELLED_DAYOFF },
      });
    }

    return this.mapToDayOffResponseDto(updatedDayOff);
  }
}
