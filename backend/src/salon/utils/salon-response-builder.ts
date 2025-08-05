import { SUCCESS_MESSAGES } from "src/common/constants/success.constants";
import {
  SalonResponseDto,
  SalonListResponseDto,
  PaginationDto,
  SalonCreateResponseDto,
  SalonUpdateResponseDto,
  SalonDeleteResponseDto,
} from "../dto/salon-response.dto";

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

export function buildSalonCreateResponse(
  salon: SalonData,
): SalonCreateResponseDto {
  return {
    message: SUCCESS_MESSAGES.SALON.CREATED,
    data: buildSalonResponse(salon),
  };
}

export function buildSalonUpdateResponse(
  salon: SalonData,
): SalonUpdateResponseDto {
  return {
    message: SUCCESS_MESSAGES.SALON.UPDATED,
    data: buildSalonResponse(salon),
  };
}

export function buildSalonDeleteResponse(): SalonDeleteResponseDto {
  return {
    message: SUCCESS_MESSAGES.SALON.DELETED,
  };
}
