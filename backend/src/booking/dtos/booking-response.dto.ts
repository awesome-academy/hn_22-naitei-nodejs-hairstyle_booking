import { PaginationDto } from "../../common/dtos/pagination.dto";

export class BookingResponseDto {
  id: string;
  customer: {
    id: string;
    fullName: string;
  };
  totalPrice: number;
  status: string;
  createdAt: Date;
  salon: {
    id: string;
    name: string;
  };
  stylist: {
    id: string;
    fullName: string;
  };
  services: {
    id: string;
    name: string;
    price: number;
  }[];
  timeslots: {
    id: string;
    startTime: Date;
    endTime: Date;
  }[];
}

export class BookingListResponseDto {
  data: BookingResponseDto[];
  pagination: PaginationDto;
}
