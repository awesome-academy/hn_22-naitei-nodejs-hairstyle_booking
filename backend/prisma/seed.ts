import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { addDays } from "date-fns";
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

async function main() {
  const roles = ["ADMIN", "MANAGER", "STYLIST", "CUSTOMER"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
  // 2. Bootstrap work schedules cho stylist
>>>>>>> 5b223ae (cronjob & bookingflow)
=======
>>>>>>> bf85059 (fix logic update status booking)
  const stylists = await prisma.stylist.findMany();
  if (!stylists.length) {
    console.log("⚠️ Không có stylist nào trong hệ thống, bỏ qua tạo lịch.");
    return;
  }

  for (let i = 0; i < 7; i++) {
    const targetDate = addDays(new Date(), i);

    for (const stylist of stylists) {
      await prisma.workSchedule.create({
        data: {
          workingDate: targetDate,
          morningStartTime: setTime(targetDate, MORNING_START),
          morningEndTime: setTime(targetDate, MORNING_END),
          afternoonStart: setTime(targetDate, AFTERNOON_START),
          afternoonEnd: setTime(targetDate, AFTERNOON_END),
          stylist: { connect: { id: stylist.id } },
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
