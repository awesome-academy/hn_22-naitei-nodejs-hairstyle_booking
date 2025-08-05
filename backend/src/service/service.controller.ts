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
import { ServiceService } from "./service.service";
import { Public } from "../common/decorators/public.decorator";
import { GetServicesQueryDto } from "./dto/get-services-query.dto";
import {
  ServiceCreateResponseDto,
  ServiceDeleteResponseDto,
  ServiceListResponseDto,
  ServiceUpdateResponseDto,
} from "./dto/service-response.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { UpdateServiceDto } from "src/service/dto/update-service.dto";
import { CreateServiceDto } from "src/service/dto/create-service.dto";

@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Public()
  @Get()
  async getAllServices(
    @Query() query: GetServicesQueryDto,
  ): Promise<ServiceListResponseDto> {
    return this.serviceService.getAllServices(query);
  }

  @Roles(RoleName.ADMIN)
  @Post()
  async createService(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceCreateResponseDto> {
    return this.serviceService.createService(createServiceDto);
  }

  @Roles(RoleName.ADMIN)
  @Put(":id")
  async updateService(
    @Param("id") id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceUpdateResponseDto> {
    return this.serviceService.updateService(id, updateServiceDto);
  }

  @Roles(RoleName.ADMIN)
  @Delete(":id")
  async deleteService(
    @Param("id") id: string,
  ): Promise<ServiceDeleteResponseDto> {
    return this.serviceService.deleteService(id);
  }
}
