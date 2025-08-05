import { CustomerResponseLoginDto } from "../dtos/customer/auth-customer.dto";
import { ManagerResponseLoginDto } from "../dtos/manager/auth-manager.dto";
import { StylistResponseLoginDto } from "../dtos/stylist/auth-stylist.dto";
import { UserResponseLoginDto } from "../dtos/user/user-response-login.dto";

interface RoleData {
  id: string;
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

export function buildCustomerLoginResponse(
  user: UserData,
  customer?: CustomerData | null,
): CustomerResponseLoginDto {
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

interface SalonData {
  id: string;
  name: string;
  address: string;
}

interface StylistData {
  id: string;
  userId: string;
  salonId: string;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  salon: SalonData;
}

export function buildStylistLoginResponse(
  user: UserData,
  stylist?: StylistData | null,
): StylistResponseLoginDto {
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
    salonName: stylist?.salon?.name ?? "",
    salonAddress: stylist?.salon?.address ?? "",
  };
}

interface ManagerData {
  id: string;
  userId: string;
  salonId: string;
  createdAt: Date;
  updatedAt: Date;
  salon: { id: string; name: string; address: string };
}
export function buildManagerLoginResponse(
  user: UserData,
  manager?: ManagerData | null,
): ManagerResponseLoginDto {
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
    salonName: manager?.salon?.name ?? "",
    salonAddress: manager?.salon?.address ?? "",
  };
}

export function buildUserResponseForAdmin(
  user: UserData,
): UserResponseLoginDto {
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
