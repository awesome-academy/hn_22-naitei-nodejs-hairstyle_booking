export class SalonStatsDto {
  salonId: string;
  date: Date;
  totalBookings: number;
  completed: number;
  cancelled: number;
  cancelledEarly: number;
  cancelledDayOff: number;
}
