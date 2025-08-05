import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../common/constants/work-schedule.const";
import { generateTimeSlotsForShift, setTime } from "../common/utils/date.util";
import { addDays } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";

@Injectable()
export class WorkSchedulesJob {
  private readonly logger = new Logger(WorkSchedulesJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron("0 0 0 * * *") // chạy 0h mỗi ngày
  async handleGenerateWorkSchedules() {
    this.logger.log("Running work schedule generation job...");

const stylists = await this.prisma.stylist.findMany();

const targetDate = addDays(new Date(), 6);

for (const stylist of stylists) {
  // Kiểm tra stylist có đơn nghỉ approved ngày target không
  const dayOff = await this.prisma.dayOff.findFirst({
    where: {
      stylistId: stylist.id,
      date: {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate),
      },
      status: "APPROVED",
    },
  });

  const existing = await this.prisma.workSchedule.findFirst({
    where: { stylistId: stylist.id, workingDate: targetDate },
  });
  if (existing) continue;

  await this.prisma.workSchedule.create({
    data: {
      stylistId: stylist.id,
      workingDate: targetDate,
      morningStartTime: setTime(targetDate, MORNING_START),
      morningEndTime: setTime(targetDate, MORNING_END),
      afternoonStart: setTime(targetDate, AFTERNOON_START),
      afternoonEnd: setTime(targetDate, AFTERNOON_END),
      isDayOff: !!dayOff,
      timeSlots: {
        create: [
          ...generateTimeSlotsForShift(
            targetDate,
            MORNING_START,
            MORNING_END,
            SLOT_DURATION_MINUTES,
          ),
          ...generateTimeSlotsForShift(
            targetDate,
            AFTERNOON_START,
            AFTERNOON_END,
            SLOT_DURATION_MINUTES,
          ),
        ].map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: false,
        })),
      },
    },
  });
}
  }
}
