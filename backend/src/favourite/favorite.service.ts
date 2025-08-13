import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.constants';
import { RoleName } from 'src/common/enums/role-name.enum';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavoriteStylist(customerUserId: string, stylistId: string): Promise<any> {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!customer || customer.user.role.name !== RoleName.CUSTOMER) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_CUSTOMER_ROLE);
    }

    const stylist = await this.prisma.stylist.findUnique({
      where: { id: stylistId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!stylist || stylist.user.role.name !== RoleName.STYLIST) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.STYLIST_NOT_FOUND);
    }

    const existingFavorite = await this.prisma.stylistFavorite.findFirst({
      where: {
        customerId: customer.id,
        stylistId: stylist.id,
      },
    });
    if (existingFavorite) {
      throw new ConflictException(ERROR_MESSAGES.FAVORITE.ALREADY_FAVORITED);
    }

    return this.prisma.stylistFavorite.create({
      data: {
        customerId: customer.id,
        stylistId: stylist.id,
      },
      include: {
        stylist: { include: { user: true } },
        customer: { include: { user: true } },
      },
    });
  }

  async removeFavoriteStylist(customerUserId: string, stylistId: string): Promise<{ message: string }> {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!customer || customer.user.role.name !== RoleName.CUSTOMER) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_CUSTOMER_ROLE);
    }

    const stylist = await this.prisma.stylist.findUnique({
      where: { id: stylistId },
      select: { id: true }
    });
    if (!stylist) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.STYLIST_NOT_FOUND);
    }

    const deleteResult = await this.prisma.stylistFavorite.deleteMany({
      where: {
        customerId: customer.id,
        stylistId: stylist.id,
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException(ERROR_MESSAGES.FAVORITE.NOT_FAVORITED);
    }

    return { message: 'Stylist removed from favorites successfully.' };
  }

  async getFavoriteStylists(customerUserId: string): Promise<any[]> {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true, user: { select: { role: true } } }
    });
    if (!customer || customer.user.role.name !== RoleName.CUSTOMER) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.NOT_CUSTOMER_ROLE);
    }

    const favorites = await this.prisma.stylistFavorite.findMany({
      where: { customerId: customer.id },
      include: {
        stylist: {
          include: {
            user: true,
            salon: true
          }
        }
      }
    });

    return favorites.map(fav => ({
      id: fav.stylist.id,
      fullName: fav.stylist.user.fullName,
      email: fav.stylist.user.email,
      phone: fav.stylist.user.phone,
      avatar: fav.stylist.user.avatar,
      rating: fav.stylist.rating,
      ratingCount: fav.stylist.ratingCount,
      salonName: fav.stylist.salon.name,
      salonAddress: fav.stylist.salon.address,
    }));
  }
}