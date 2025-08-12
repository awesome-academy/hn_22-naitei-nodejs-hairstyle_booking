import { BookingResponseDto } from "../dtos/booking-response.dto";

export interface BookingData {
  id: string;
  totalPrice: number;
  customer: {
    user: {
      id: string;
      fullName: string;
    };
  };
  status: string; // hoặc enum BookingStatus
  createdAt: Date;
  salon: {
    id: string;
    name: string;
  };
  stylist: {
    user: {
      id: string;
      fullName: string;
    };
  };
  services: {
    service: {
      id: string;
      name: string;
      price: number;
    };
  }[];
  timeslots: {
    timeSlot: {
      id: string;
      startTime: Date;
      endTime: Date;
    };
  }[];
}

export function buildBookingResponse(data: BookingData): BookingResponseDto {
  return {
    id: data.id,
    customer: {
      id: data.customer.user.id,
      fullName: data.customer.user.fullName,
    },
    totalPrice: data.totalPrice,
    status: data.status,
    createdAt: data.createdAt,
    salon: {
      id: data.salon.id,
      name: data.salon.name,
    },
    stylist: {
      id: data.stylist.user.id,
      fullName: data.stylist.user.fullName,
    },
    services: data.services.map((s) => ({
      name: s.service.name,
      id: s.service.id,
      price: s.service.price,
    })),
    timeslots: data.timeslots.map((t) => ({
      id: t.timeSlot.id,
      startTime: t.timeSlot.startTime,
      endTime: t.timeSlot.endTime,
    })),
  };
}
