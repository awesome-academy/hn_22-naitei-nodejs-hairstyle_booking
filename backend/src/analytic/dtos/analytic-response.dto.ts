import { SalonStatsDto } from "./salon-stats.dto";
import { ServiceStatsDto } from "./service-stats.dto";
import { StylistStatsDto } from "./stylist-stats.dto";

export class AnalyticsAdminResponseDto {
  salons: SalonStatsDto[];
  services: ServiceStatsDto[];
}

export class AnalyticsManagerResponseDto {
  stylists: StylistStatsDto[];
  services: ServiceStatsDto[];
}
