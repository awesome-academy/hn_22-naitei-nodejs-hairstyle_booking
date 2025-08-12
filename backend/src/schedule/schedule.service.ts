import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { addDays, startOfDay, endOfDay } from "date-fns";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchedulesOfStylist(stylistId: string) {
    if (!stylistId) {
      throw new BadRequestException("stylistId is required");
    }

    const fromDate = startOfDay(new Date());
    const toDate = endOfDay(addDays(fromDate, 6));

    const schedules = await this.prisma.workSchedule.findMany({
      where: {
        stylistId,
        workingDate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        workingDate: true,
        isDayOff: true,
        timeSlots: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            isBooked: true,
          },
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: { workingDate: "asc" },
    });

    return schedules;
  }
}
