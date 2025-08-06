export interface ServiceResponseDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  totalBookings: number;
  createdAt: Date;
}

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ServiceListResponseDto {
  data: ServiceResponseDto[];
  pagination: PaginationDto;
}
