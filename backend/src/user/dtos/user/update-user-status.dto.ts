import { IsBoolean } from "class-validator";

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class UpdateUserStatusResponseDto {
  userId: string;
  fullName: string;
  isActive: boolean;
}
