import { Controller, Get, Query } from "@nestjs/common";
import { StylistService } from "./stylist.service";
import { Public } from "../common/decorators/public.decorator";
import { GetStylistsQueryDto } from "./dto/get-stylists-query.dto";
import { StylistListResponseDto } from "./dto/stylist-response.dto";

@Controller("stylists")
export class StylistController {
  constructor(private readonly stylistService: StylistService) {}

  @Public()
  @Get()
  async getAllStylists(
    @Query() query: GetStylistsQueryDto,
  ): Promise<StylistListResponseDto> {
    return this.stylistService.getListByCustomer(query);
  }
}
