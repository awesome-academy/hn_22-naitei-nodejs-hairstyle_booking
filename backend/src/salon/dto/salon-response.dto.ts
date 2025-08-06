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

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SalonListResponseDto {
  data: SalonResponseDto[];
  pagination: PaginationDto;
}
