import { IsEnum, IsNotEmpty } from 'class-validator';
import { DayOffStatus } from 'src/common/enums/day-off-status.enum'; 

export class UpdateDayOffStatusDto {
  @IsNotEmpty()
  @IsEnum(DayOffStatus, { message: 'Status must be APPROVED or REJECTED.' })
  status: DayOffStatus.APPROVED | DayOffStatus.REJECTED;
}