import { Controller, Get, Query } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { Public } from "../common/decorators/public.decorator";
import { GetServicesQueryDto } from "./dto/get-services-query.dto";
import { ServiceListResponseDto } from "./dto/service-response.dto";

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
}
