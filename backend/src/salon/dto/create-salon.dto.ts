import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsUrl,
} from "class-validator";

export class CreateSalonDto {
  @IsNotEmpty({ message: "Salon name is required" })
  @IsString()
  @MaxLength(100, { message: "Salon name must not exceed 100 characters" })
  name: string;

  @IsNotEmpty({ message: "Address is required" })
  @IsString()
  @MaxLength(255, { message: "Address must not exceed 255 characters" })
  address: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: "Phone number must not exceed 20 characters" })
  phone?: string;
}
