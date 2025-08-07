import {
  StylistResponseDto,
  StylistListResponseDto,
} from "../dto/stylist-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

interface StylistData {
  rating: number;
  ratingCount: number;
  salon: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
    gender: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: {
      name: string;
    };
  };
}

export function buildStylistResponse(stylist: StylistData): StylistResponseDto {
  return {
    id: stylist.user.id,
    fullName: stylist.user.fullName ?? "",
    email: stylist.user.email,
    phone: stylist.user.phone,
    avatar: stylist.user.avatar,
    gender: stylist.user.gender,
    isActive: stylist.user.isActive,
    createdAt: stylist.user.createdAt,
    updatedAt: stylist.user.updatedAt,
    role: stylist.user.role,
    rating: stylist.rating,
    ratingCount: stylist.ratingCount,
    salon: {
      id: stylist.salon.id,
      name: stylist.salon.name,
    },
  };
}

export function buildStylistListResponse(
  stylists: StylistData[],
  pagination: PaginationDto,
): StylistListResponseDto {
  return {
    data: stylists.map(buildStylistResponse),
    pagination,
  };
}
