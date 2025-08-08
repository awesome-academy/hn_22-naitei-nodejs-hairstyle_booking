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
export interface SalonCreateResponseDto {
  message: string;
  data: SalonResponseDto;
}

export interface SalonUpdateResponseDto {
  message: string;
  data: SalonResponseDto;
}

export interface SalonDeleteResponseDto {
  message: string;
}
