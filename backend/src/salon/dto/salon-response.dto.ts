import { PaginationDto } from "src/common/dtos/pagination.dto";

export interface SalonResponseDto {
  id: string;
  name: string;
  address: string;
  avatar: string | null;
  phone: string | null;
  stylistCount: number;
  totalBookings: number;
  createdAt: Date;
}

export interface SalonListResponseDto {
  data: SalonResponseDto[];
  pagination: PaginationDto;
}
