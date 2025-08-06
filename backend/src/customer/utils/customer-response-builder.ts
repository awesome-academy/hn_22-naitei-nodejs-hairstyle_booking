import {
  CustomerResponseDto,
  CustomerListResponseDto,
} from "../dtos/customer-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

interface CustomerData {
  totalCompleted: number;
  totalCancelled: number;
  totalSpending: number;
  memberTier?: {
    id: string;
    name: string;
    minSpending: number;
    discountPercent: number;
  } | null;
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

export function buildCustomerResponse(
  customer: CustomerData,
): CustomerResponseDto {
  return {
    id: customer.user.id,
    fullName: customer.user.fullName ?? "",
    email: customer.user.email,
    phone: customer.user.phone,
    avatar: customer.user.avatar,
    gender: customer.user.gender,
    isActive: customer.user.isActive,
    createdAt: customer.user.createdAt,
    updatedAt: customer.user.updatedAt,
    role: {
      name: customer.user.role.name,
      description: customer.user.role.description ?? undefined,
    },
    totalCompleted: customer.totalCompleted,
    totalCancelled: customer.totalCancelled,
    totalSpending: customer.totalSpending,
    memberTier: customer.memberTier
      ? {
          id: customer.memberTier.id,
          name: customer.memberTier.name,
          minSpending: customer.memberTier.minSpending,
          discountPercent: customer.memberTier.discountPercent,
        }
      : undefined,
  };
}

export function buildCustomerListResponse(
  customers: CustomerData[],
  pagination: PaginationDto,
): CustomerListResponseDto {
  return {
    data: customers.map(buildCustomerResponse),
    pagination,
  };
}
