import { PaginationDto } from "../../../common/dtos/pagination.dto";

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  role: {
    name: string;
    description?: string;
  };
}

export class UserListResponseDto {
  data: UserResponseDto[];
  pagination: PaginationDto;
}
