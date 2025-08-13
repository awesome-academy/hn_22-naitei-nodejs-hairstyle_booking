import { Controller, Post, Delete, Param, UseGuards, Req, Get } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role-name.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.CUSTOMER)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':stylistId')
  async addFavoriteStylist(
    @CurrentUser() user: JwtPayload,
    @Param('stylistId') stylistId: string,
  ): Promise<any> {
    return this.favoriteService.addFavoriteStylist(user.id, stylistId);
  }

  @Delete(':stylistId')
  async removeFavoriteStylist(
    @CurrentUser() user: JwtPayload,
    @Param('stylistId') stylistId: string,
  ): Promise<{ message: string }> {
    return this.favoriteService.removeFavoriteStylist(user.id, stylistId);
  }

  @Get()
  async getFavoriteStylists(@CurrentUser() user: JwtPayload): Promise<any[]> {
    return this.favoriteService.getFavoriteStylists(user.id);
  }
}