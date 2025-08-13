import { IsBoolean, IsDate, IsString } from 'class-validator';

export class NotificationResponseDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  isRead: boolean;

  @IsDate()
  createdAt: Date;
}