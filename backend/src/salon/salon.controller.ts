import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { SalonService } from "./salon.service";
import { Public } from "../common/decorators/public.decorator";
import { GetSalonsQueryDto } from "./dto/get-salons-query.dto";
import {
  SalonCreateResponseDto,
  SalonDeleteResponseDto,
  SalonListResponseDto,
  SalonUpdateResponseDto,
} from "./dto/salon-response.dto";
import { RoleName } from "../common/enums/role-name.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { CreateSalonDto } from "src/salon/dto/create-salon.dto";
import { UpdateSalonDto } from "src/salon/dto/update-salon.dto";
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

  @Roles(RoleName.ADMIN)
  @Post()
  async createSalon(
    @Body() createSalonDto: CreateSalonDto,
  ): Promise<SalonCreateResponseDto> {
    return this.salonService.createSalon(createSalonDto);
  }

  @Roles(RoleName.ADMIN)
  @Put(":id")
  async updateSalon(
    @Param("id") id: string,
    @Body() updateSalonDto: UpdateSalonDto,
  ): Promise<SalonUpdateResponseDto> {
    return this.salonService.updateSalon(id, updateSalonDto);
  }

  @Roles(RoleName.ADMIN)
  @Delete(":id")
  async deleteSalon(@Param("id") id: string): Promise<SalonDeleteResponseDto> {
    return this.salonService.deleteSalon(id);
  }
}
