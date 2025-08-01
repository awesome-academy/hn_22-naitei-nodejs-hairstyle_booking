import { UserResponseLoginDto } from "../user/user-response-login.dto";

export class CustomerResponseLoginDto extends UserResponseLoginDto {
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

export class AuthCustomerResponseDto {
  access_token: string;
  customer: CustomerResponseLoginDto;
}
