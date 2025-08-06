import {
  ServiceResponseDto,
  ServiceListResponseDto,
} from "../dto/service-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
interface ServiceData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  createdAt: Date;
  _count: {
    bookingServices: number;
  };
}

export function buildServiceResponse(service: ServiceData): ServiceResponseDto {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    totalBookings: service._count.bookingServices,
    createdAt: service.createdAt,
  };
}

export function buildServiceListResponse(
  services: ServiceData[],
  pagination: PaginationDto,
): ServiceListResponseDto {
  return {
    data: services.map(buildServiceResponse),
    pagination,
  };
}
