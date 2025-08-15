import { IsArray, ArrayNotEmpty, IsUUID, IsInt, Min } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  stylistId: string;

  @IsUUID()
  salonId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  timeSlotIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  serviceIds: string[];

  @IsUUID()
  workScheduleId: string;
}
