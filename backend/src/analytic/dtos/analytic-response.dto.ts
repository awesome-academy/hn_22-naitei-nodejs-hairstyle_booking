export class AnalyticsAdminResponseDto {
  salons: AggregatedSalonStatsDto[];
  services: AggregatedServiceStatsDto[];
}

export class AnalyticsManagerResponseDto {
  stylists: AggregatedStylistStatsDto[];
  services: AggregatedServiceStatsDto[];
}

export class AggregatedSalonStatsDto {
  salonId: string;
  salonName: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  cancelledEarly: number;
  cancelledDayOff: number;
  revenue: number;
}

export class AggregatedStylistStatsDto {
  stylistId: string;
  stylistName: string;
  salonId: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  cancelledEarly: number;
  cancelledDayOff: number;
  revenue: number;
}

export class AggregatedServiceStatsDto {
  serviceId: string;
  serviceName: string;
  salonId: string | null;
  usedCount: number;
}
