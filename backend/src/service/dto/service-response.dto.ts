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
