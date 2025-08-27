import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";
import { RoleName } from "src/common/enums/role-name.enum";
import { NotificationResponseDto } from "./dtos/notification-response.dto";

import { Notification } from "@prisma/client";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToNotificationResponseDto(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      content: notification.content,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }

  async getNotificationDetail(
    notificationId: string,
    userId: string,
    userRole: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new NotFoundException(ERROR_MESSAGES.NOTIFICATION.NOT_FOUND);
    }

    if (userRole !== RoleName.ADMIN && notification.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.NOTIFICATION.NOT_OWNER);
    }
    return this.mapToNotificationResponseDto(notification);
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string,
    userRole: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(ERROR_MESSAGES.NOTIFICATION.NOT_FOUND);
    }

    if (userRole !== RoleName.ADMIN && notification.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.NOTIFICATION.NOT_OWNER);
    }

    if (notification.isRead) {
      return this.mapToNotificationResponseDto(notification);
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return this.mapToNotificationResponseDto(updatedNotification);
  }

  async getAllByUser(
    userId: string,
    userRole: string,
  ): Promise<NotificationResponseDto[]> {
    const whereClause =
      userRole === RoleName.ADMIN
        ? {}
        : { userId };

    const notifications = await this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return notifications.map(this.mapToNotificationResponseDto);
  }
}
