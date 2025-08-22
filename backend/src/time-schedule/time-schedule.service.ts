import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";

@Injectable()
export class TimeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getTimeSchedulesOfStylist(userId: string) {
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.STYLIST.NOT_FOUND);
    }

    const stylistId = stylist.id;
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
            bookingTimeslots: {
              select: { bookingId: true },
            },
          },
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: { workingDate: "asc" },
    });

    return schedules.map((ws) => ({
      workingDate: ws.workingDate,
      isDayOff: ws.isDayOff,
      timeSlots: ws.isDayOff
        ? []
        : ws.timeSlots.map((ts) => ({
            id: ts.id,
            startTime: ts.startTime,
            endTime: ts.endTime,
            isBooked: ts.isBooked,
            bookingId: ts.bookingTimeslots[0]?.bookingId || null,
          })),
    }));
  }
}
