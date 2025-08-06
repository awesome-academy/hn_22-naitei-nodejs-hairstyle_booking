import { UserResponseLoginDto } from "../user/user-response-login.dto";

export class StylistResponseLoginDto extends UserResponseLoginDto {
  rating: number;
  ratingCount: number;
  salonId: string;
  salonName: string;
  salonAddress: string;
}

export class AuthStylistResponseDto {
  access_token: string;
  stylist: StylistResponseLoginDto;
}
