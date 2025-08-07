import { IsString, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Invalid phone number format.' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid avatar URL format.' })
  avatar?: string;
}