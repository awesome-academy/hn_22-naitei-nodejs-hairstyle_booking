// analytic.service.ts
import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AnalyticsQueryDto } from "./dtos/analytic-request.dto";
import {
  AnalyticsAdminResponseDto,
  AnalyticsManagerResponseDto,
  AggregatedSalonStatsDto,
  AggregatedStylistStatsDto,
  AggregatedServiceStatsDto,
} from "./dtos/analytic-response.dto";
import { RoleName } from "../common/enums/role-name.enum";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";

@Injectable()
export class AnalyticService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminAnalytics(
    user: { id: string; role: string },
    query: AnalyticsQueryDto,
  ): Promise<AnalyticsAdminResponseDto> {
    if (user.role !== RoleName.ADMIN)
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_ADMIN_ROLE);

    const now = new Date();
    const fromDate = query.fromDate
      ? new Date(query.fromDate)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const toDate = query.toDate ? new Date(query.toDate) : now;

    const salonRaw = await this.prisma.salonDailyStats.findMany({
      where: { date: { gte: fromDate, lte: toDate } },
      include: { salon: { select: { name: true } } },
    });

    const salonMap = new Map<string, AggregatedSalonStatsDto>();
    for (const s of salonRaw) {
      if (!salonMap.has(s.salonId)) {
        salonMap.set(s.salonId, {
          salonId: s.salonId,
          totalBookings: 0,
          salonName: s.salon.name,
          completed: 0,
          cancelled: 0,
          cancelledEarly: 0,
          cancelledDayOff: 0,
          revenue: 0,
        });
      }
      const agg = salonMap.get(s.salonId)!;
      agg.totalBookings += s.totalBookings;
      agg.completed += s.completed;
      agg.cancelled += s.cancelled;
      agg.cancelledEarly += s.cancelledEarly;
      agg.cancelledDayOff += s.cancelledDayOff;
      agg.revenue += s.revenue;
    }
    const salons: AggregatedSalonStatsDto[] = Array.from(salonMap.values());

    let year: number, month: number;
    if (query.fromMonth && query.toMonth) {
      [year, month] = query.fromMonth.split("-").map(Number);
    } else {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      year = d.getFullYear();
      month = d.getMonth() + 1;
    }

    const serviceRaw = await this.prisma.serviceMonthlyStats.findMany({
      where: { isGlobal: true, year, month },
      include: { service: { select: { name: true } } },
    });

    const serviceMap = new Map<string, AggregatedServiceStatsDto>();
    for (const s of serviceRaw) {
      if (!serviceMap.has(s.serviceId)) {
        serviceMap.set(s.serviceId, {
          serviceId: s.serviceId,
          serviceName: s.service.name,
          salonId: null,
          usedCount: 0,
        });
      }
      serviceMap.get(s.serviceId)!.usedCount += s.usedCount;
    }

    const services: AggregatedServiceStatsDto[] = Array.from(
      serviceMap.values(),
    );

    return { salons, services };
  }

  async getManagerAnalytics(
    user: { id: string; role: string },
    query: AnalyticsQueryDto,
  ): Promise<AnalyticsManagerResponseDto> {
    if (user.role !== RoleName.MANAGER) throw new ForbiddenException();

    const manager = await this.prisma.manager.findUnique({
      where: { userId: user.id },
    });
    if (!manager || !manager.salonId)
      throw new ForbiddenException(ERROR_MESSAGES.MANAGER.SALON_NOT_FOUND);

    const salonId = manager.salonId;
    const now = new Date();
    const fromDate = query.fromDate
      ? new Date(query.fromDate)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const toDate = query.toDate ? new Date(query.toDate) : now;

    const stylistRaw = await this.prisma.stylistDailyStats.findMany({
      where: { salonId, date: { gte: fromDate, lte: toDate } },
      include: {
        stylist: { include: { user: { select: { fullName: true } } } },
      },
    });

    const stylistMap = new Map<string, AggregatedStylistStatsDto>();
    for (const s of stylistRaw) {
      if (!stylistMap.has(s.stylistId)) {
        stylistMap.set(s.stylistId, {
          stylistId: s.stylistId,
          stylistName: s.stylist.user.fullName,
          salonId: s.salonId,
          totalBookings: 0,
          completed: 0,
          cancelled: 0,
          cancelledEarly: 0,
          cancelledDayOff: 0,
          revenue: 0,
        });
      }
      const agg = stylistMap.get(s.stylistId)!;
      agg.totalBookings += s.totalBookings;
      agg.completed += s.completed;
      agg.cancelled += s.cancelled;
      agg.cancelledEarly += s.cancelledEarly;
      agg.cancelledDayOff += s.cancelledDayOff;
      agg.revenue += s.revenue;
    }
    const stylists: AggregatedStylistStatsDto[] = Array.from(
      stylistMap.values(),
    );

    let year: number, month: number;
    if (query.fromMonth && query.toMonth) {
      [year, month] = query.fromMonth.split("-").map(Number);
    } else {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      year = d.getFullYear();
      month = d.getMonth() + 1;
    }

    const serviceRaw = await this.prisma.serviceMonthlyStats.findMany({
      where: { salonId, year, month },
      include: { service: { select: { name: true } } },
    });

    const serviceMap = new Map<string, AggregatedServiceStatsDto>();
    for (const s of serviceRaw) {
      const key = s.serviceId;
      if (!serviceMap.has(key)) {
        serviceMap.set(key, {
          serviceId: s.serviceId,
          serviceName: s.service.name,
          salonId: s.salonId,
          usedCount: 0,
        });
      }
      serviceMap.get(key)!.usedCount += s.usedCount;
    }

    const services: AggregatedServiceStatsDto[] = Array.from(
      serviceMap.values(),
    );

    return { stylists, services };
  }
}
