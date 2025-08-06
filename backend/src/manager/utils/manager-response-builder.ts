import {
  ManagerResponseDto,
  ManagerListResponseDto,
} from "../dtos/manager-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

interface ManagerData {
  salonId: string;
  user: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
    gender: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: {
      name: string;
      description?: string | null;
    };
  };
}

export function buildManagerResponse(manager: ManagerData): ManagerResponseDto {
  return {
    id: manager.user.id,
    fullName: manager.user.fullName ?? "",
    email: manager.user.email,
    phone: manager.user.phone,
    avatar: manager.user.avatar,
    gender: manager.user.gender,
    isActive: manager.user.isActive,
    createdAt: manager.user.createdAt,
    updatedAt: manager.user.updatedAt,
    role: {
      name: manager.user.role.name,
      description: manager.user.role.description ?? undefined,
    },
    salonId: manager.salonId,
  };
}

export function buildManagerListResponse(
  managers: ManagerData[],
  pagination: PaginationDto,
): ManagerListResponseDto {
  return {
    data: managers.map(buildManagerResponse),
    pagination,
  };
}
