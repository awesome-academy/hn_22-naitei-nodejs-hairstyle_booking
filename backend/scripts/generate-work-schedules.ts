import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../src/common/constants/work-schedule.const";
import {
  generateTimeSlotsForShift,
  setTime,
} from "../src/common/utils/date.util";
import { addDays, startOfDay, endOfDay } from "date-fns";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log("Manual generate WS + TS for X+6...");

  const stylists = await prisma.stylist.findMany();
  const targetDate = addDays(new Date(), 6);

  for (const stylist of stylists) {
    const dayOff = await prisma.dayOff.findFirst({
      where: {
        stylistId: stylist.id,
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
        status: "APPROVED",
      },
    });

    const existing = await prisma.workSchedule.findFirst({
      where: { stylistId: stylist.id, workingDate: targetDate },
    });
    if (existing) continue;

    await prisma.workSchedule.create({
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

  console.log(`✅ Work schedules generated for ${targetDate.toDateString()}`);
  await app.close();
}

bootstrap();
