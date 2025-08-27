import { Notification } from "@prisma/client";

export interface NotificationWithUnreadCount extends Notification {
  unreadCount: number;
}
