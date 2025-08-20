import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  AnalyticsAdminResponseDto,
  AnalyticsManagerResponseDto,
} from "./dtos/analytic-response.dto";

@Injectable()
export class AnalyticService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminAnalytics(adminId: string): Promise<AnalyticsAdminResponseDto> {
    const salons = await this.prisma.salonDailyStats.findMany({
      orderBy: { date: "desc" },
      take: 100,
    });

    const services = await this.prisma.serviceMonthlyStats.findMany({
      where: { isGlobal: true },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 100,
    });

    return { salons, services };
  }

  async getManagerAnalytics(
    managerId: string,
  ): Promise<AnalyticsManagerResponseDto> {
    const salon = await this.prisma.salon.findUnique({
      where: { managerId },
    });

    if (!salon) {
      throw new NotFoundException("Salon not found for this manager");
    }

    const stylists = await this.prisma.stylistDailyStats.findMany({
      where: { salonId: salon.id },
      orderBy: { date: "desc" },
      take: 100,
    });

    const services = await this.prisma.serviceMonthlyStats.findMany({
      where: { salonId: salon.id },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 100,
    });

    return { stylists, services };
  }
}
