import { UserResponseDto } from "../user/user-response.dto";
export class ManagerResponseDto extends UserResponseDto {
  salonId: string;
}

export class ListManagerResponseDto {
  data: ManagerResponseDto[];
  total: number;
}
