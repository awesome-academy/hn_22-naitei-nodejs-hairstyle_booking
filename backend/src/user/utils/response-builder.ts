// response-builder.ts

import { CustomerResponseLoginDto } from "../dtos/customer/auth-customer.dto";

interface RoleData {
  id: string;
  name: string;
  description?: string | null; // cho phép null hoặc undefined
}

interface UserData {
  id: string;
  fullName: string | null; // cho phép null
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
