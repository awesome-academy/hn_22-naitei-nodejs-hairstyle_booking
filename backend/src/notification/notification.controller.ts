import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtPayload } from "src/common/types/jwt-payload.interface";
import { RolesGuard } from "../common/guards/roles.guard";

import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { NotificationResponseDto } from "./dtos/notification-response.dto";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleName.CUSTOMER, RoleName.STYLIST, RoleName.MANAGER, RoleName.ADMIN)
  @Get(":id")
  async getNotificationDetail(
    @Param("id") notificationId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.getNotificationDetail(
      notificationId,
      user.id,
      user.role,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(RoleName.CUSTOMER, RoleName.STYLIST, RoleName.MANAGER, RoleName.ADMIN)
  @Patch(":id/read")
  async markNotificationAsRead(
    @Param("id") notificationId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.markNotificationAsRead(
      notificationId,
      user.id,
      user.role,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(RoleName.CUSTOMER, RoleName.STYLIST, RoleName.MANAGER, RoleName.ADMIN)
  @Get()
  async getAllNotifications(
    @CurrentUser() user: JwtPayload,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.getAllByUser(user.id, user.role);
  }
}
