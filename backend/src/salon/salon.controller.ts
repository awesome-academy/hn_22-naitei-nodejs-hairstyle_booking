import { Controller, Get, Query } from "@nestjs/common";
import { SalonService } from "./salon.service";
import { Public } from "../common/decorators/public.decorator";
import { GetSalonsQueryDto } from "./dto/get-salons-query.dto";
import { SalonListResponseDto } from "./types/salon-response.types";

@Controller("salons")
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Public()
  @Get()
  async getAllSalons(
    @Query() query: GetSalonsQueryDto,
  ): Promise<SalonListResponseDto> {
    return await this.salonService.getAllSalons(query);
  }
}
