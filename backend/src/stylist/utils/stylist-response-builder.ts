import {
  StylistResponseDto,
  StylistListResponseDto,
  PaginationDto,
} from "../dto/stylist-response.dto";

interface StylistData {
  id: string;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  user: {
    id: string;
    fullName: string | null;
    avatar: string | null;
    phone: string | null;
  };
  salon: {
    id: string;
    name: string;
    address: string;
  };
  _count: {
    bookings: number;
    reviews: number;
    favoritedBy: number;
  };
}

export function buildStylistResponse(stylist: StylistData): StylistResponseDto {
  return {
    id: stylist.id,
    userId: stylist.user.id,
    name: stylist.user.fullName ?? "Unknown",
    avatar: stylist.user.avatar,
    phone: stylist.user.phone,
    rating: stylist.rating,
    ratingCount: stylist.ratingCount,
    salon: stylist.salon,
    totalBookings: stylist._count.bookings,
    totalReviews: stylist._count.reviews,
    totalFavorites: stylist._count.favoritedBy,
    createdAt: stylist.createdAt,
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
