export class TimeSlotResponseDto {
  id: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export class WorkScheduleResponseDto {
  workingDate: Date;
  isDayOff: boolean;
  timeSlots: TimeSlotResponseDto[];
}
