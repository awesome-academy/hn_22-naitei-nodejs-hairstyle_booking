import { UserResponseDto } from "../../user/dtos/user/user-response.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";

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

export class CustomerListResponseDto {
  data: CustomerResponseDto[];
  pagination: PaginationDto;
}

export class AuthCustomerResponseDto {
  access_token: string;
  customer: CustomerResponseDto;
}
