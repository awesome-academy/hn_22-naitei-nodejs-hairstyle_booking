import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
import { RoleName } from 'src/common/enums/role-name.enum';

import { DayOffResponseDto } from './dtos/day-off-response.dto';
import { CreateDayOffDto } from './dtos/create-day-off.dto';
import { UpdateDayOffStatusDto } from './dtos/update-day-off-status.dto';

import { DayOff, DayOffStatus as PrismaDayOffStatus } from '@prisma/client';
import { DayOffStatus } from 'src/common/enums/day-off-status.enum';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDayOffResponseDto(dayOff: DayOff): DayOffResponseDto {
    return {
      id: dayOff.id,
      stylistId: dayOff.stylistId,
      salonId: dayOff.salonId,
      date: dayOff.date,
      reason: dayOff.reason ?? undefined,
      status: dayOff.status as DayOffStatus,
      createdAt: dayOff.createdAt,
      updatedAt: dayOff.updatedAt,
    };
  }

  async createDayOffRequest(userId: string, userRole: string, dto: CreateDayOffDto): Promise<DayOffResponseDto> {
    if (userRole !== RoleName.STYLIST) { throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_STYLIST); }
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: userId },
      select: { id: true, salonId: true },
    });
    if (!stylist) { throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND); }

    const requestDate = new Date(dto.date);
    requestDate.setHours(0, 0, 0, 0);

    if (requestDate < new Date(new Date().setHours(0,0,0,0))) {
      throw new BadRequestException('Cannot request day off for past dates.');
    }

    const existingDayOff = await this.prisma.dayOff.findFirst({
      where: {
        stylistId: stylist.id,
        date: requestDate,
        status: { notIn: [PrismaDayOffStatus.REJECTED, PrismaDayOffStatus.CANCELED] }
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
    });
    return this.mapToDayOffResponseDto(dayOff);
  }

  async cancelDayOffRequest(userId: string, userRole: string, dayOffId: string): Promise<{ message: string }> {
    if (userRole !== RoleName.STYLIST) { throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_STYLIST); }
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: userId },
      select: { id: true },
    });
    if (!stylist) { throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND); }

    const dayOffToCancel = await this.prisma.dayOff.findUnique({
      where: { id: dayOffId },
    });

    if (!dayOffToCancel) { throw new NotFoundException(ERROR_MESSAGES.DAY_OFF.NOT_FOUND); }
    if (dayOffToCancel.stylistId !== stylist.id) { throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_OWNER); }

    if (dayOffToCancel.status !== PrismaDayOffStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGES.DAY_OFF.ALREADY_APPROVED_OR_REJECTED);
    }

    try {
      await this.prisma.dayOff.update({
        where: { id: dayOffId },
        data: { status: PrismaDayOffStatus.CANCELED }
      });
      return { message: 'Day off request cancelled successfully.' };
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.DAY_OFF.CANCELLATION_FAILED);
    }
  }

  async getDayOffRequests(userId: string, userRole: string): Promise<DayOffResponseDto[]> {
    let whereClause: any = {};

    if (userRole === RoleName.STYLIST) {
      const stylist = await this.prisma.stylist.findUnique({
        where: { userId: userId },
        select: { id: true },
      });
      if (!stylist) { throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND); }
      whereClause = { stylistId: stylist.id };
    } else if (userRole === RoleName.MANAGER) {
      const manager = await this.prisma.manager.findUnique({
        where: { userId: userId },
        select: { salonId: true },
      });
      if (!manager) { throw new ForbiddenException('Manager not associated with a salon.'); }
      whereClause = { salonId: manager.salonId };
    } else if (userRole === RoleName.ADMIN) {
    } else {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_OWNER);
    }

    const dayOffRequests = await this.prisma.dayOff.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });
    return dayOffRequests.map(this.mapToDayOffResponseDto);
  }

  async approveOrRejectDayOffRequest(
    managerUserId: string,
    managerUserRole: string,
    dayOffId: string,
    dto: UpdateDayOffStatusDto,
  ): Promise<DayOffResponseDto> {
    if (managerUserRole !== RoleName.MANAGER && managerUserRole !== RoleName.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST);
    }

    const dayOff = await this.prisma.dayOff.findUnique({
      where: { id: dayOffId },
      include: { stylist: { include: { user: true } } },
    });
    if (!dayOff) { throw new NotFoundException(ERROR_MESSAGES.DAY_OFF.NOT_FOUND); }

    if (dayOff.status !== PrismaDayOffStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGES.DAY_OFF.INVALID_STATUS_UPDATE);
    }

    if (managerUserRole === RoleName.MANAGER) {
      const manager = await this.prisma.manager.findUnique({
        where: { userId: managerUserId },
        select: { salonId: true },
      });
      if (!manager) { throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST); }
      if (dayOff.stylist.salonId !== manager.salonId) { throw new ForbiddenException(ERROR_MESSAGES.DAY_OFF.NOT_MANAGER_FOR_STYLIST); }
    }

    const updatedDayOff = await this.prisma.dayOff.update({
      where: { id: dayOffId },
      data: { status: dto.status },
    });

    return this.mapToDayOffResponseDto(updatedDayOff);
  }
}