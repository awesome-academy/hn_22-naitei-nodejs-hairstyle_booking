import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  avatar?: string;
}
