import { IsString, IsOptional, IsPhoneNumber, IsUrl } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: "Invalid phone number format." })
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  avatar?: string;
}
