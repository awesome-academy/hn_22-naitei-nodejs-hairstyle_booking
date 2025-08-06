import { IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetStylistsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  salonId?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minRating?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
