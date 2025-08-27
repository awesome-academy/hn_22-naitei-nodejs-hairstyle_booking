import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

import { UpdateUserDto } from "src/user/dtos/user/update-user.dto";
import { ChangePasswordDto } from "src/user/dtos/user/change-password.dto";

import { ERROR_MESSAGES } from "src/common/constants/error.constants";
import { User } from "@prisma/client";
import { UserResponseDto } from "src/user/dtos/user/user-response.dto";
import { CustomerResponseDto } from "src/customer/dtos/customer-response.dto";
import { StylistResponseDto } from "src/stylist/dto/stylist-response.dto";
import { ManagerResponseDto } from "src/manager/dtos/manager-response.dto";
import { buildUserResponse } from "../user/utils/response-builder";
import { buildCustomerResponse } from "../customer/utils/customer-response-builder";

import { buildStylistResponse } from "../stylist/utils/stylist-response-builder";
import { buildManagerResponse } from "../manager/utils/manager-response-builder";

import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getUserProfile(
    userId: string,
  ): Promise<
    | CustomerResponseDto
    | StylistResponseDto
    | ManagerResponseDto
    | UserResponseDto
  > {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true,
        gender: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { name: true } },
        customer: { include: { memberTier: true } },
        stylist: { include: { salon: true } },
        manager: { include: { salon: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    switch (user.role.name) {
      case "CUSTOMER":
        if (!user || !user.customer) {
          throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND);
        }
        return buildCustomerResponse({
          totalCompleted: user.customer.totalCompleted,
          totalCancelled: user.customer.totalCancelled,
          totalSpending: user.customer.totalSpending,
          memberTier: user.customer.memberTier,
          user,
        });
      case "STYLIST":
        if (!user || !user.stylist) {
          throw new NotFoundException(ERROR_MESSAGES.STYLIST.NOT_FOUND);
        }
        return buildStylistResponse({
          salon: user.stylist.salon,
          rating: user.stylist.rating,
          ratingCount: user.stylist.ratingCount,
          user,
        });
      case "MANAGER":
        if (!user || !user.manager) {
          throw new NotFoundException(ERROR_MESSAGES.MANAGER.NOT_FOUND);
        }
        return buildManagerResponse({
          ...user.manager,
          user: user,
        });
      default:
        const { customer, stylist, manager, ...userWithoutCSM } = user;
        return buildUserResponse(userWithoutCSM);
    }
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingUserWithPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingUserWithPhone && existingUserWithPhone.id !== userId) {
        throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);
      }
    }

    let avatarUrl = user.avatar;
    if (dto.avatar) {
      try {
        avatarUrl = await this.cloudinaryService.uploadImage(
          dto.avatar,
          "avatars",
        );
      } catch (e) {
        console.error("Failed to upload avatar:", e);
        throw new BadRequestException("Failed to upload avatar");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName ?? user.fullName,
        phone: dto.phone ?? user.phone,
        gender: dto.gender ?? user.gender,
        avatar: avatarUrl,
      },
      include: { role: true },
    });

    return buildUserResponse(updatedUser);
  }

  async changeUserPassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT);
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException(
        "New password and confirmation do not match.",
      );
    }
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        "New password cannot be the same as the current password.",
      );
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully." };
  }
}
