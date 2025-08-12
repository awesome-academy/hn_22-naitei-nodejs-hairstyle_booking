import { IsOptional, IsEnum, IsDateString, Min } from "class-validator";
import { Type } from "class-transformer";
import { BookingStatus } from "../../common/enums/booking-status.enum"; // enum BookingStatus nếu có

export class GetBookingsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
