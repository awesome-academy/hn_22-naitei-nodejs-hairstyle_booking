export interface StylistResponseDto {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  rating: number;
  ratingCount: number;
  salon: {
    id: string;
    name: string;
    address: string;
  };
  totalBookings: number;
  totalReviews: number;
  totalFavorites: number;
  createdAt: Date;
}

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface StylistListResponseDto {
  data: StylistResponseDto[];
  pagination: PaginationDto;
}
