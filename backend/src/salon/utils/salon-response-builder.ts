import {
  SalonResponseDto,
  SalonListResponseDto,
} from "../dto/salon-response.dto";

import { PaginationDto } from "src/common/dtos/pagination.dto";
// Interface cho data từ Prisma
interface SalonData {
  id: string;
  name: string;
  address: string;
  avatar: string | null;
  phone: string | null;
  createdAt: Date;
  _count: {
    stylists: number;
    bookings: number;
  };
}

export function buildSalonResponse(salon: SalonData): SalonResponseDto {
  return {
    id: salon.id,
    name: salon.name,
    address: salon.address,
    avatar: salon.avatar,
    phone: salon.phone,
    stylistCount: salon._count.stylists,
    totalBookings: salon._count.bookings,
    createdAt: salon.createdAt,
  };
}

export function buildSalonListResponse(
  salons: SalonData[],
  pagination: PaginationDto,
): SalonListResponseDto {
  return {
    data: salons.map(buildSalonResponse),
    pagination,
  };
}
