import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from 'src/user/dtos/user/update-user.dto';
import { ChangePasswordDto } from 'src/user/dtos/user/change-password.dto';

import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
import { User } from '@prisma/client';
import { UserResponseDto } from 'src/user/dtos/user/user-response.dto';
import { StylistResponseDto } from 'src/user/dtos/stylist/stylist-response.dto';
import { ManagerResponseDto } from 'src/user/dtos/manager/manager-response.dto';
import { CustomerResponseDto } from 'src/user/dtos/customer/customer-response.dto';
import { RoleName } from 'src/common/enums/role-name.enum';
import { buildCustomerResponse, buildManagerResponse, buildStylistResponse, buildUserResponse } from 'src/user/utils/response-builder';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

async getUserProfile(userId: string): Promise<
    CustomerResponseDto | StylistResponseDto | ManagerResponseDto | UserResponseDto
  > {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        customer: { include: { memberTier: true } },
        stylist: { include: { salon: true } },
        manager: { include: { salon: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    switch (user.role.name) {
      case RoleName.CUSTOMER:
        return buildCustomerResponse(user, user.customer);
      case RoleName.STYLIST:
        return buildStylistResponse(user, user.stylist);
      case RoleName.MANAGER:
        return buildManagerResponse(user, user.manager);
      default:
        return buildUserResponse(user);
    }
  }

  async updateUserProfile(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingUserWithPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existingUserWithPhone && existingUserWithPhone.id !== userId) {
        throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName ?? user.fullName,
        phone: dto.phone ?? user.phone,
        address: dto.address ?? user.address,
        gender: dto.gender ?? user.gender,
        avatar: dto.avatar ?? user.avatar,
      },
      include: { role: true },
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName ?? '',
      email: updatedUser.email,
      phone: updatedUser.phone ?? null,
      avatar: updatedUser.avatar ?? null,
      gender: updatedUser.gender ?? null,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      role: {
        name: updatedUser.role.name,
        description: updatedUser.role.description ?? undefined,
      },
    };
  }

  async changeUserPassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('New password and confirmation do not match.');
    }
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('New password cannot be the same as the current password.');
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully.' };
  }
}