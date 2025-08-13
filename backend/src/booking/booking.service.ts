import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { GetBookingsQueryDto } from "./dtos/get-bookings-query.dto";
import { UpdateBookingStatusDto } from "./dtos/update-booking-status.dto";
import {
  BookingResponseDto,
  BookingListResponseDto,
} from "./dtos/booking-response.dto";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { buildBookingResponse } from "./utils/build-booking-response";
import { getCancelStatus } from "./utils/get-cancel-status";
import {
  customerUpdateStatusBooking,
  stylistUpdateStatusBooking,
} from "./utils/update-status-booking";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { RoleName } from "../common/enums/role-name.enum";
import { BookingStatus } from "../common/enums/booking-status.enum";

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(
    customerId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      // Kiểm tra tất cả timeSlotIds chưa bị đặt
      const availableSlots = await tx.timeSlot.findMany({
        where: {
          id: { in: dto.timeSlotIds },
          isBooked: false,
        },
      });

      if (availableSlots.length !== dto.timeSlotIds.length) {
        throw new BadRequestException(
          "Một hoặc nhiều khung giờ đã bị đặt, vui lòng chọn khung giờ khác.",
        );
      }

      const booking = await tx.booking.create({
        data: {
          customerId,
          stylistId: dto.stylistId,
          salonId: dto.salonId,
          totalPrice: dto.totalPrice,
          status: "PENDING",
          services: {
            create: dto.serviceIds.map((serviceId) => ({ serviceId })),
          },
        },
      });

      // Tạo bookingTimeslot & update isBooked
      for (const timeSlotId of dto.timeSlotIds) {
        await tx.bookingTimeslot.create({
          data: {
            bookingId: booking.id,
            timeSlotId,
          },
        });
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: { isBooked: true },
        });
      }

      const fullBooking = await tx.booking.findUnique({
        where: { id: booking.id },
        select: {
          id: true,
          customer: {
            select: { user: { select: { id: true, fullName: true } } },
          },
          totalPrice: true,
          status: true,
          createdAt: true,
          salon: { select: { id: true, name: true } },
          stylist: {
            select: { user: { select: { id: true, fullName: true } } },
          },
          services: {
            select: {
              service: { select: { id: true, name: true, price: true } },
            },
          },
          timeslots: {
            select: {
              timeSlot: {
                select: { id: true, startTime: true, endTime: true },
              },
            },
          },
        },
      });
      if (!fullBooking) {
        throw new NotFoundException("Booking not found");
      }
      return buildBookingResponse(fullBooking);
    });
  }

  async getBookingDetail(
    user: JwtPayload,
    bookingId: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        customer: {
          select: { user: { select: { id: true, fullName: true } } },
        },
        totalPrice: true,
        status: true,
        createdAt: true,
        salon: { select: { id: true, name: true } },
        stylist: { select: { user: { select: { id: true, fullName: true } } } },
        services: {
          select: {
            service: { select: { id: true, name: true, price: true } },
          },
        },
        timeslots: {
          select: {
            timeSlot: { select: { id: true, startTime: true, endTime: true } },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking không tồn tại");
    }

    const role = String(user.role || "").toUpperCase();

    // Quyền truy cập
    if (role === RoleName.ADMIN) {
    } else if (role === RoleName.CUSTOMER) {
      if (booking.customer.user.id !== user.id) {
        throw new ForbiddenException("Bạn không có quyền xem booking này");
      }
    } else if (role === RoleName.STYLIST) {
      if (booking.stylist.user.id !== user.id) {
        throw new ForbiddenException("Bạn không có quyền xem booking này");
      }
    } else if (role === RoleName.MANAGER) {
      const managerSalon = await this.prisma.manager.findFirst({
        where: { id: user.id },
        select: { salonId: true },
      });

      if (!managerSalon) {
        throw new ForbiddenException("Bạn không phải là manager");
      }

      if (booking.salon.id !== managerSalon.salonId) {
        throw new ForbiddenException("Bạn không có quyền xem booking này");
      }
    } else {
      throw new ForbiddenException("Bạn không có quyền xem booking này");
    }
    return buildBookingResponse(booking);
  }

  async getBookings(
    user: JwtPayload,
    query: GetBookingsQueryDto,
  ): Promise<BookingListResponseDto> {
    const { status, fromDate, toDate, page = 1, limit = 10 } = query;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }
      if (toDate) {
        where.createdAt.lte = new Date(toDate);
      }
    }

    // Check quyền theo role
    const role = user.role;

    if (role === RoleName.CUSTOMER) {
      where.customer = { userId: user.id };
    } else if (role === RoleName.STYLIST) {
      where.stylist = { userId: user.id };
    } else if (role === RoleName.MANAGER) {
      const managerSalon = await this.prisma.manager.findFirst({
        where: { user: { id: user.id } },
        select: { salonId: true },
      });

      if (!managerSalon) {
        throw new ForbiddenException("Bạn không phải là manager");
      }

      where.salonId = managerSalon.salonId;
    } else if (role !== RoleName.ADMIN) {
      throw new ForbiddenException("Bạn không có quyền xem danh sách bookings");
    }

    const [totalItems, bookings] = await this.prisma.$transaction([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customer: {
            select: { user: { select: { id: true, fullName: true } } },
          },
          totalPrice: true,
          status: true,
          createdAt: true,
          salon: { select: { id: true, name: true } },
          stylist: {
            select: { user: { select: { id: true, fullName: true } } },
          },
          services: {
            select: {
              service: { select: { id: true, name: true, price: true } },
            },
          },
          timeslots: {
            select: {
              timeSlot: {
                select: { id: true, startTime: true, endTime: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      data: bookings.map((b) => buildBookingResponse(b)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async updateBookingStatus(
    id: string,
    user: JwtPayload,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        stylist: true,
        timeslots: {
          include: { timeSlot: true },
          orderBy: { timeSlot: { startTime: "asc" } },
          take: 1,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    // CUSTOMER hủy booking
    if (user.role === "CUSTOMER") {
      if (booking.customer.userId !== user.id) {
        throw new ForbiddenException("Not your booking");
      }
      if (booking.status !== BookingStatus.PENDING) {
        throw new BadRequestException("Only pending bookings can be cancelled");
      }

      const firstSlot = booking.timeslots[0]?.timeSlot;
      if (!firstSlot) {
        throw new BadRequestException("Booking has no timeslot");
      }

      const newStatus = getCancelStatus(firstSlot.startTime, 3);

      return customerUpdateStatusBooking(
        booking.id,
        booking.customerId,
        booking.customer.userId,
        newStatus,
      );
    }
    // STYLIST cập nhật completed hoặc cancelled
    if (user.role === "STYLIST") {
      if (booking.stylist.userId !== user.id) {
        throw new ForbiddenException("Not your booking");
      }
      if (
        ![BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(dto.status)
      ) {
        throw new BadRequestException("Invalid status for stylist");
      }
      const firstSlot = booking.timeslots[0]?.timeSlot;
      if (!firstSlot) {
        throw new BadRequestException("Booking has no timeslot");
      }

      const newStatus = getCancelStatus(firstSlot.startTime, 3);

      return stylistUpdateStatusBooking(
        booking.id,
        booking.customerId,
        booking.customer.userId,
        newStatus,
      );
    }
    throw new ForbiddenException("Role not allowed to update booking status");
  }
}
