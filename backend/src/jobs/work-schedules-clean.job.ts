import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { subDays } from "date-fns";
import { RETENTION_DAYS } from "../common/constants/work-schedule.const";

@Injectable()
export class WorkScheduleCleanupJob {
  private readonly logger = new Logger(WorkScheduleCleanupJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron("0 30 0 * * *") // 0:30 AM mỗi ngày
  async handleCleanupOldSchedules() {
    const cutoffDate = subDays(new Date(), RETENTION_DAYS);

    // Lấy các workSchedule id có workingDate cũ hơn cutoffDate
    const oldSchedules = await this.prisma.workSchedule.findMany({
      where: { workingDate: { lt: cutoffDate } },
      select: { id: true },
    });

    const scheduleIds = oldSchedules.map((ws) => ws.id);

    if (scheduleIds.length === 0) {
      this.logger.log(
        `No old work schedules found before ${cutoffDate.toDateString()}`,
      );
      return;
    }

    // Xóa tất cả TimeSlot liên quan tới các workSchedule cũ này
    const deletedSlots = await this.prisma.timeSlot.deleteMany({
      where: { scheduleId: { in: scheduleIds } },
    });

    this.logger.log(
      `Deleted ${deletedSlots.count} old time slots linked to work schedules before ${cutoffDate.toDateString()}`,
    );
  }
}
