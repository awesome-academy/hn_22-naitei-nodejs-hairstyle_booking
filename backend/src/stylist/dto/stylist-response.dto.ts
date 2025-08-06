import { UserResponseDto } from "src/user/dtos/user/user-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export interface StylistResponseDto extends UserResponseDto {
  rating: number;
  ratingCount: number;
  salonId: string;
}

export class ListStylistResponseDto {
  data: StylistResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class AuthStylistResponseDto {
  access_token: string;
  stylist: StylistResponseDto;
}

export interface StylistListResponseDto {
  data: StylistResponseDto[];
  pagination: PaginationDto;
}
