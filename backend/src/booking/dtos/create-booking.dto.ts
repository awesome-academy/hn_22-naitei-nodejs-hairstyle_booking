import { IsArray, ArrayNotEmpty, IsUUID, IsInt, Min } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  stylistId: string;

  @IsUUID()
  salonId: string;

<<<<<<< HEAD
=======
  @IsInt()
  @Min(0)
  totalPrice: number;

>>>>>>> 5b223ae (cronjob & bookingflow)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  timeSlotIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  serviceIds: string[];
<<<<<<< HEAD
<<<<<<< HEAD

  @IsUUID()
  workScheduleId: string;
=======
>>>>>>> 5b223ae (cronjob & bookingflow)
=======

  @IsUUID()
  workScheduleId: string;
>>>>>>> 2be3561 (fix logic bookings & logic stylist DayOff approved)
}
