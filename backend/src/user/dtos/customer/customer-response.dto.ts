import { UserResponseDto } from "../user/user-response.dto";

export class CustomerResponseDto extends UserResponseDto {
  totalCompleted: number;
  totalCancelled: number;
  totalSpending: number;

  memberTier?: {
    id: string;
    name: string;
    minSpending: number;
    discountPercent: number;
  };
}

export class ListCustomerResponseDto {
  data: CustomerResponseDto[];
  total: number;
}

export class AuthCustomerResponseDto {
  access_token: string;
  customer: CustomerResponseDto;
}
