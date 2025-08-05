import { UserResponseDto } from "../user/user-response.dto";

export class StylistResponseDto extends UserResponseDto {
  rating: number;
  ratingCount: number;
  salonId: string;
}

export class ListStylistResponseDto {
  data: StylistResponseDto[];
  total: number;
}

export class AuthStylistResponseDto {
  access_token: string;
  stylist: StylistResponseDto;
}
