import { IsOptional, IsString, MaxLength, IsUrl } from "class-validator";

export class UpdateSalonDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Salon name must not exceed 100 characters" })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Address must not exceed 255 characters" })
  address?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: "Phone number must not exceed 20 characters" })
  phone?: string;
}
