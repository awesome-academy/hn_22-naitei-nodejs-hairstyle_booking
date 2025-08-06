import { CustomerResponseDto } from "../../customer/dtos/customer-response.dto";
import { StylistResponseDto } from "../../stylist/dto/stylist-response.dto";
import { UserResponseDto } from "../dtos/user/user-response.dto";
import { ManagerResponseDto } from "../../manager/dtos/manager-response.dto";

interface RoleData {
  name: string;
  description?: string | null;
}

interface UserData {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  gender?: string | null;
  avatar?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role: RoleData;
}

export function buildUserResponse(user: UserData): UserResponseDto {
  return {
    id: user.id,
    fullName: user.fullName ?? "",
    email: user.email,
    phone: user.phone,
    gender: user.gender ?? null,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isActive: user.isActive,
    role: {
      name: user.role.name,
      description: user.role.description ?? undefined,
    },
  };
}
