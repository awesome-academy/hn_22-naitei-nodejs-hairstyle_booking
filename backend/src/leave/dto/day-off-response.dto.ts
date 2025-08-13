import { IsDate, IsOptional, IsString } from 'class-validator';

export class DayOffResponseDto {
  @IsString()
  id: string;

  @IsString()
  stylistId: string;

  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}