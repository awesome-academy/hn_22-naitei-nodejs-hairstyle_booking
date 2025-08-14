import { DayOffStatus } from '../../common/enums/day-off-status.enum'; 

export class DayOffResponseDto {
  id: string;
  stylistId: string;
  salonId: string;
  date: Date;
  reason?: string;
  status: DayOffStatus;
  createdAt: Date;
  updatedAt: Date;
}