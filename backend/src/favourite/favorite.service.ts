import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
import { RoleName } from 'src/common/enums/role-name.enum';

import { StylistFavoriteResponseDto } from './dtos/stylist-favorite-response.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  private async getValidCustomerId(userId: string): Promise<string> {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: userId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!customer || customer.user.role.name !== RoleName.CUSTOMER) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_CUSTOMER_ROLE);
    }
    return customer.id;
  }

  private async getValidStylistId(stylistId: string): Promise<string> {
    const stylist = await this.prisma.stylist.findUnique({
      where: { id: stylistId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!stylist || stylist.user.role.name !== RoleName.STYLIST) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.STYLIST_NOT_FOUND);
    }
    return stylist.id;
  }

  async addFavoriteStylist(customerUserId: string, customerId: string): Promise<StylistFavoriteResponseDto> {
    const cId = await this.getValidCustomerId(customerUserId);
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: customerId },
    });
    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.STYLIST_NOT_FOUND);
    }
    const sId = await this.getValidStylistId(stylist.id);

    const existingFavorite = await this.prisma.stylistFavorite.findFirst({
      where: {
        customerId: cId,
        stylistId: sId,
      },
    });
    if (existingFavorite) {
      throw new ConflictException(ERROR_MESSAGES.FAVORITE.ALREADY_FAVORITED);
    }

    const favorite = await this.prisma.stylistFavorite.create({
      data: {
        customerId: cId,
        stylistId: sId,
      },
    });
    return {
      id: favorite.id,
      customerId: favorite.customerId,
      stylistId: favorite.stylistId,
      createdAt: favorite.createdAt,
    };
  }

  async removeFavoriteStylist(customerUserId: string, customerId: string): Promise<{ message: string }> {
    const cId = await this.getValidCustomerId(customerUserId);
    const stylist = await this.prisma.stylist.findUnique({
      where: { userId: customerId },
    });
    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.STYLIST_NOT_FOUND);
    }
    const sId = await this.getValidStylistId(stylist.id);

    const deleteResult = await this.prisma.stylistFavorite.deleteMany({
      where: {
        customerId: cId,
        stylistId: sId,
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.NOT_FAVORITED);
    }

    return { message: 'Stylist removed from favorites successfully.' };
  }
}