import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { CustomerListResponseDto } from "../customer/dtos/customer-response.dto";
import { StylistListResponseDto } from "../stylist/dto/stylist-response.dto";
import { ManagerListResponseDto } from "../manager/dtos/manager-response.dto";
import { UserListResponseDto } from "./dtos/user/user-response.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
