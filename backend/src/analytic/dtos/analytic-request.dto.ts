import { IsOptional, IsDateString, Matches } from "class-validator";

export class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/)
  fromMonth?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/)
  toMonth?: string;
}
