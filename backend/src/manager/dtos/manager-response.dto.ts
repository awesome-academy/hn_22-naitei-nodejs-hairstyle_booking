import { UserResponseDto } from "../../user/dtos/user/user-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class ManagerResponseDto extends UserResponseDto {
  salon: {
    id: string;
    name: string;
  };
}

export class AuthManagerResponseDto {
  access_token: string;
  manager: ManagerResponseDto;
}

export class ManagerListResponseDto {
  data: ManagerResponseDto[];
  pagination: PaginationDto;
}
