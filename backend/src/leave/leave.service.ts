import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
import { RoleName } from 'src/common/enums/role-name.enum';

import { DayOff } from '@prisma/client';
import { DayOffResponseDto } from './dto/day-off-response.dto';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDayOffResponseDto(dayOff: DayOff): DayOffResponseDto {
    return {
      id: dayOff.id,
      stylistId: dayOff.stylistId,
      date: dayOff.date,
      reason: dayOff.reason ?? undefined, 
      createdAt: dayOff.createdAt,
      updatedAt: dayOff.updatedAt,
    };
  }

  async getMyDayOffRequests(userId: string, userRole: string): Promise<DayOffResponseDto[]> {
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

    const dayOffRequests = await this.prisma.dayOff.findMany({
      where: { stylistId: stylist.id },
      orderBy: { date: 'desc' },
    });

    return dayOffRequests.map(this.mapToDayOffResponseDto);
  }

}