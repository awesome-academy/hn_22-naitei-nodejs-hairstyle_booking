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

export class ListUserResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
