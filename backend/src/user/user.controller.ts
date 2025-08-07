import { Controller, Get, UseGuards, Query, Put, Body, Req, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { ListCustomerResponseDto } from "./dtos/customer/customer-response.dto";
import { ListStylistResponseDto } from "./dtos/stylist/stylist-response.dto";
import { ListManagerResponseDto } from "./dtos/manager/manager-response.dto";
import { ListUserResponseDto, UserResponseDto } from "./dtos/user/user-response.dto";
import { UpdateUserDto } from "./dtos/user/update-user.dto";
import { ChangePasswordDto } from "./dtos/user/change-password.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MANAGER")
  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query("role") role?: "CUSTOMER" | "STYLIST" | "MANAGER",
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ): Promise<
    | ListCustomerResponseDto
    | ListStylistResponseDto
    | ListManagerResponseDto
    | ListUserResponseDto
  > {
    return this.userService.findUsersByViewer(
      user,
      role,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile') 
  async getMyProfile(@CurrentUser() user: JwtPayload): Promise<any> {
    console.log(user);
    const userId = user.id;
    const userProfile = await this.userService.getUserProfile(userId);
    return userProfile;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile') 
  async updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/change-password')
  async changeMyPassword(
    @CurrentUser() user: JwtPayload, 
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changeUserPassword(user.id, dto);
  }
}
