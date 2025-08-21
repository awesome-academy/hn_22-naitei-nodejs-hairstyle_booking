import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../../common/constants/work-schedule.const";
import {
  generateTimeSlotsForShift,
  setTime,
} from "../../common/utils/date.util";

export async function bootstrapWorkScheduleForStylist(
  prisma: PrismaClient,
  stylistId: string,
) {
  const today = new Date();
  const days = 7;
  for (let i = 0; i < days; i++) {
    const targetDate = addDays(today, i);

    await prisma.workSchedule.create({
      data: {
        workingDate: targetDate,
        morningStartTime: setTime(targetDate, MORNING_START),
        morningEndTime: setTime(targetDate, MORNING_END),
        afternoonStart: setTime(targetDate, AFTERNOON_START),
        afternoonEnd: setTime(targetDate, AFTERNOON_END),
        stylist: { connect: { id: stylistId } },
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
