import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

@Injectable()
export class StatsAggregationJob {
  private readonly logger = new Logger(StatsAggregationJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron("0 5 0 * * *") // chạy 00:05 mỗi ngày
  async aggregateDailyStats() {
    this.logger.log("Running daily stats aggregation...");

    const targetDate = subDays(new Date(), 1);
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const bookings = await this.prisma.booking.findMany({
      where: {
        workSchedule: {
          workingDate: { gte: start, lte: end },
        },
      },
      include: {
        stylist: true,
        salon: true,
        workSchedule: true,
      },
    });

    // --- Group theo salon ---
    const salonGroups = new Map<string, (typeof bookings)[number][]>();
    for (const b of bookings) {
      const salonId = b.salon.id;
      if (!salonGroups.has(salonId)) salonGroups.set(salonId, []);
      salonGroups.get(salonId)!.push(b);
    }

    for (const [salonId, salonBookings] of salonGroups) {
      const stats = this.buildStats(salonBookings);
      await this.prisma.salonDailyStats.upsert({
        where: { salonId_date: { salonId, date: start } },
        update: stats,
        create: { salonId, date: start, ...stats },
      });
    }

    // --- Group theo stylist ---
    const stylistGroups = new Map<string, (typeof bookings)[number][]>();
    for (const b of bookings) {
      const stylistId = b.stylist.id;
      if (!stylistGroups.has(stylistId)) stylistGroups.set(stylistId, []);
      stylistGroups.get(stylistId)!.push(b);
    }

    for (const [stylistId, stylistBookings] of stylistGroups) {
      const stats = this.buildStats(stylistBookings);
      await this.prisma.stylistDailyStats.upsert({
        where: { stylistId_date: { stylistId, date: start } },
        update: stats,
        create: {
          stylistId,
          salonId: stylistBookings[0].salon.id,
          date: start,
          ...stats,
        },
      });
    }
  }

  @Cron("0 10 0 1 * *") // chạy 00:10 ngày 1 mỗi tháng
  async aggregateMonthlyServiceStats() {
    this.logger.log("Running monthly service stats aggregation...");

    const lastMonth = subMonths(new Date(), 1);
    const start = startOfMonth(lastMonth);
    const end = endOfMonth(lastMonth);

    const bookings = await this.prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        workSchedule: {
          workingDate: { gte: start, lte: end },
        },
      },
      include: {
        salon: true,
        workSchedule: true,
        services: true,
      },
    });

    // Map key = `${serviceId}_${salonId}`
    const serviceGroups = new Map<
      string,
      { serviceId: string; salonId: string }[]
    >();

    for (const booking of bookings) {
      const salonId = booking.salon.id;

      for (const bs of booking.services) {
        const key = `${bs.serviceId}_${salonId}`;
        if (!serviceGroups.has(key)) {
          serviceGroups.set(key, []);
        }
        serviceGroups.get(key)!.push({ serviceId: bs.serviceId, salonId });
      }
    }

    for (const [key, svcItems] of serviceGroups) {
      const [serviceId, salonId] = key.split("_");
      const usedCount = svcItems.length;

      await this.prisma.serviceMonthlyStats.upsert({
        where: {
          serviceId_salonId_year_month: {
            serviceId,
            salonId,
            year: lastMonth.getFullYear(),
            month: lastMonth.getMonth() + 1,
          },
        },
        update: { usedCount, isGlobal: false },
        create: {
          serviceId,
          salonId,
          year: lastMonth.getFullYear(),
          month: lastMonth.getMonth() + 1,
          usedCount,
          isGlobal: false,
        },
      });

      await this.prisma.serviceMonthlyStats.upsert({
        where: {
          serviceId_salonId_year_month: {
            serviceId,
            salonId: null as any,
            year: lastMonth.getFullYear(),
            month: lastMonth.getMonth() + 1,
          },
        },
        update: { usedCount, isGlobal: true },
        create: {
          serviceId,
          salonId: null,
          year: lastMonth.getFullYear(),
          month: lastMonth.getMonth() + 1,
          usedCount,
          isGlobal: true,
        },
      });
    }
  }

  private buildStats(bookings: any[]) {
    let totalBookings = bookings.length;

    let completed = bookings.filter((b) => b.status === "COMPLETED").length;
    let cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    let cancelledEarly = bookings.filter(
      (b) => b.status === "CANCELLED_EARLY",
    ).length;
    let cancelledDayOff = bookings.filter(
      (b) => b.status === "CANCELLED_DAY_OFF",
    ).length;

    return {
      totalBookings,
      completed,
      cancelled,
      cancelledEarly,
      cancelledDayOff,
    };
  }
}
