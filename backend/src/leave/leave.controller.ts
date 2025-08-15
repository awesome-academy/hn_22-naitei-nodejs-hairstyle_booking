import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { LeaveService } from "./leave.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtPayload } from "src/common/types/jwt-payload.interface";

import { DayOffResponseDto } from "./dtos/day-off-response.dto";
import { CreateDayOffDto } from "./dtos/create-day-off.dto";
import { UpdateDayOffStatusDto } from "./dtos/update-day-off-status.dto";

@UseGuards(JwtAuthGuard)
@Controller("leaves")
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleName.STYLIST, RoleName.MANAGER, RoleName.ADMIN)
  @Get()
  async getDayOffRequests(
    @CurrentUser() user: JwtPayload,
  ): Promise<DayOffResponseDto[]> {
    return this.leaveService.getDayOffRequests(user.id, user.role);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleName.STYLIST)
  @Post()
  async createDayOffRequest(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDayOffDto,
  ): Promise<DayOffResponseDto> {
    return this.leaveService.createDayOffRequest(user.id, user.role, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleName.STYLIST)
  @Delete(":id")
  async cancelDayOffRequest(
    @CurrentUser() user: JwtPayload,
    @Param("id") dayOffId: string,
  ): Promise<{ message: string }> {
    return this.leaveService.cancelDayOffRequest(user.id, user.role, dayOffId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleName.MANAGER)
  @Patch(":id/status")
  async approveOrRejectDayOffRequest(
    @CurrentUser() user: JwtPayload,
    @Param("id") dayOffId: string,
    @Body() dto: UpdateDayOffStatusDto,
  ): Promise<DayOffResponseDto> {
    return this.leaveService.approveOrRejectDayOffRequest(
      user.id,
      user.role,
      dayOffId,
      dto,
    );
  }
}
