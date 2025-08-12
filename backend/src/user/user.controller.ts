import { Controller, Get, UseGuards, Query, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { CustomerListResponseDto } from "../customer/dtos/customer-response.dto";
import {
  StylistListResponseDto,
  StylistResponseDto,
} from "../stylist/dto/stylist-response.dto";
import { CreateStylistDto } from "../stylist/dto/create-stylist.dto";
import { StylistService } from "../stylist/stylist.service";
import {
  ManagerListResponseDto,
  ManagerResponseDto,
} from "../manager/dtos/manager-response.dto";
import { CreateManagerDto } from "../manager/dtos/create-manager.dto";
import { ManagerService } from "../manager/manager.service";
import { UserListResponseDto } from "./dtos/user/user-response.dto";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly stylistService: StylistService,
    private readonly managerService: ManagerService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query("role") role?: "CUSTOMER" | "STYLIST" | "MANAGER",
    @Query("search") search?: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ): Promise<
    | CustomerListResponseDto
    | StylistListResponseDto
    | ManagerListResponseDto
    | UserListResponseDto
  > {
    return this.userService.findUsersByViewer(
      user,
      role,
      Number(page),
      Number(limit),
      search,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @Post("manager")
  createManager(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateManagerDto,
  ): Promise<ManagerResponseDto> {
    return this.managerService.createManager(user, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @Post("stylist")
  createStylist(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStylistDto,
  ): Promise<StylistResponseDto> {
    return this.stylistService.createStylist(user, dto);
  }
}
