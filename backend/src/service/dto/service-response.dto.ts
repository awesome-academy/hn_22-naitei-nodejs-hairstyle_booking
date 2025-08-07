import { PaginationDto } from "src/common/dtos/pagination.dto";

export interface ServiceResponseDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  totalBookings: number;
  createdAt: Date;
}

export interface ServiceListResponseDto {
  data: ServiceResponseDto[];
  pagination: PaginationDto;
}

export interface ServiceCreateResponseDto {
  message: string;
  data: ServiceResponseDto;
}

export interface ServiceUpdateResponseDto {
  message: string;
  data: ServiceResponseDto;
}

export interface ServiceDeleteResponseDto {
  message: string;
}
