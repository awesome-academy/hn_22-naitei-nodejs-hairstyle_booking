export class ServiceStatsDto {
  serviceId: string;
  salonId?: string | null;
  year: number;
  month: number;
  usedCount: number;
  isGlobal: boolean;
}
