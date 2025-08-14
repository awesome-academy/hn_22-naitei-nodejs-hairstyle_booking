import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateDayOffDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'Date must be a valid date string (e.g., YYYY-MM-DD).' })
  date: string;

  @IsOptional()
  @IsString()
  reason?: string;
}