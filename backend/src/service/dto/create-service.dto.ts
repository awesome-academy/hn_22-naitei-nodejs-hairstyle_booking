import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  duration: number;
}
