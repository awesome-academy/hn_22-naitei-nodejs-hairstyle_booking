import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { GetBookingsQueryDto } from "./dtos/get-bookings-query.dto";
import { UpdateBookingStatusDto } from "./dtos/update-booking-status.dto";
import { CreateReviewDto } from "./dtos/create-review.dto";
import {
  BookingResponseDto,
  BookingListResponseDto,
} from "./dtos/booking-response.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles("CUSTOMER")
  @Post()
  async createBooking(
    @CurrentUser() user: JwtPayload,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingService.createBooking(user.id, createBookingDto);
  }

  @Get()
  async getBookings(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetBookingsQueryDto,
  ): Promise<BookingListResponseDto> {
    return this.bookingService.getBookings(user, query);
  }

  @Get(":id")
  async getBookingDetail(
    @CurrentUser() user: JwtPayload,
    @Param("id") bookingId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingService.getBookingDetail(user, bookingId);
  }

  @Patch(":id/status")
  @Roles("CUSTOMER", "STYLIST")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bookingService.updateBookingStatus(id, user, dto);
  }

  @Post(":id/review")
  @Roles("CUSTOMER")
  async reviewBooking(
    @Param("id") bookingId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser("id") customerId: string,
  ) {
    return this.bookingService.reviewBooking(bookingId, customerId, dto);
  }
}
