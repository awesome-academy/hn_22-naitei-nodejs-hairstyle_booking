import { Controller, Get, Patch, Body, UseGuards, Req, Put } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { UpdateUserDto } from 'src/user/dtos/user/update-user.dto';
import { ChangePasswordDto } from 'src/user/dtos/user/change-password.dto';
import { UserResponseDto } from 'src/user/dtos/user/user-response.dto';
import { ProfileService } from './profile.service';
import { CustomerResponseDto } from 'src/user/dtos/customer/customer-response.dto';
import { StylistResponseDto } from 'src/stylist/dto/stylist-response.dto';
import { ManagerResponseDto } from 'src/user/dtos/manager/manager-response.dto';

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get() 
  async getMyProfile(@CurrentUser() user: JwtPayload): Promise<CustomerResponseDto | StylistResponseDto | ManagerResponseDto | UserResponseDto> {
    const userId = user.id;
    const userProfile = await this.profileService.getUserProfile(userId);
    return userProfile;
  }

  @UseGuards(JwtAuthGuard)
  @Put() 
  async updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.profileService.updateUserProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changeMyPassword(
    @CurrentUser() user: JwtPayload, 
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.profileService.changeUserPassword(user.id, dto);
  }
}