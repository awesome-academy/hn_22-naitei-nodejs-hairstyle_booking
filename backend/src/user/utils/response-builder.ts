import { CustomerResponseDto } from "../dtos/customer/customer-response.dto";
import { StylistResponseDto } from "../dtos/stylist/stylist-response.dto";
import { UserResponseDto } from "../dtos/user/user-response.dto";
import { ManagerResponseDto } from "../dtos/manager/manager-response.dto";

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

interface MemberTierData {
  id: string;
  name: string;
  minSpending: number;
  discountPercent: number;
}

interface CustomerData {
  totalCompleted: number;
  totalCancelled: number;
  totalSpending: number;
  memberTier?: MemberTierData | null;
}

export function buildCustomerResponse(
  user: UserData,
  customer?: CustomerData | null,
): CustomerResponseDto {
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

    totalCompleted: customer?.totalCompleted ?? 0,
    totalCancelled: customer?.totalCancelled ?? 0,
    totalSpending: customer?.totalSpending ?? 0,

    memberTier: customer?.memberTier
      ? {
          id: customer.memberTier.id,
          name: customer.memberTier.name,
          minSpending: customer.memberTier.minSpending,
          discountPercent: customer.memberTier.discountPercent,
        }
      : undefined,
  };
}

interface StylistData {
  salonId: string;
  rating: number;
  ratingCount: number;
}

export function buildStylistResponse(
  user: UserData,
  stylist?: StylistData | null,
): StylistResponseDto {
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
    rating: stylist?.rating ?? 0,
    ratingCount: stylist?.ratingCount ?? 0,
    salonId: stylist?.salonId ?? "",
  };
}

interface ManagerData {
  salonId: string;
}

export function buildManagerResponse(
  user: UserData,
  manager?: ManagerData | null,
): ManagerResponseDto {
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
    salonId: manager?.salonId ?? "",
  };
}
