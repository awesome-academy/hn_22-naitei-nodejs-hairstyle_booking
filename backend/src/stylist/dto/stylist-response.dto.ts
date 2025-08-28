import { UserResponseDto } from "src/user/dtos/user/user-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class StylistResponseDto extends UserResponseDto {
  rating: number;
  ratingCount: number;
  salon: {
    id: string;
    name: string;
  };
}

export class AuthStylistResponseDto {
  access_token: string;
  stylist: StylistResponseDto;
}

export class StylistListResponseDto {
  data: StylistResponseDto[];
  pagination: PaginationDto;
}

export class StylistWithFavouriteResponseDto extends StylistResponseDto {
  favourite: boolean;
}

export class StylistWithFavouriteListResponseDto {
  data: StylistWithFavouriteResponseDto[];
  pagination: PaginationDto;
}
