import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { GetBookingsQueryDto } from "./dtos/get-bookings-query.dto";
import { UpdateBookingStatusDto } from "./dtos/update-booking-status.dto";
import { CreateReviewDto } from "./dtos/create-review.dto";
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
import { ERROR_MESSAGES } from "../common/constants/error.constants";
import { SLOT_DURATION_MINUTES } from "src/common/constants/work-schedule.const";
import { NotificationService } from "../notification/notification.service";
import { NotificationGateway } from "../notification/notification.gateway";

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { userId: userId },
      });
      if (!customer)
        throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND);

      const stylist = await tx.stylist.findUnique({
        where: { userId: dto.stylistId },
        select: { id: true },
      });
      if (!stylist)
        throw new NotFoundException(ERROR_MESSAGES.STYLIST.NOT_FOUND);

      const services = await tx.service.findMany({
        where: { id: { in: dto.serviceIds } },
        select: { id: true, duration: true, price: true },
      });

      if (!services || services.length === 0) {
        throw new BadRequestException(ERROR_MESSAGES.SERVICE.NOT_FOUND);
      }

      const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
      const requiredSlots = Math.ceil(totalDuration / SLOT_DURATION_MINUTES);

      if (dto.timeSlotIds.length < requiredSlots) {
        throw new BadRequestException(
          `Please select at least ${requiredSlots} time slots for the chosen services.`,
        );
      }

      if (dto.timeSlotIds.length > requiredSlots) {
        throw new BadRequestException(
          `You selected too many time slots. Only ${requiredSlots} are needed for the chosen services.`,
        );
      }

      const availableSlots = await tx.timeSlot.findMany({
        where: {
          id: { in: dto.timeSlotIds },
          isBooked: false,
        },
      });

      if (availableSlots.length !== dto.timeSlotIds.length) {
        throw new BadRequestException(
          ERROR_MESSAGES.BOOKING.TIME_SLOT_ALREADY_BOOKED,
        );
      }

      availableSlots.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );

      const now = new Date();
      for (const slot of availableSlots) {
        if (slot.startTime < now) {
          throw new BadRequestException("Cannot book a time slot in the past.");
        }
      }

      for (let i = 1; i < availableSlots.length; i++) {
        if (
          availableSlots[i].startTime.getTime() !==
          availableSlots[i - 1].endTime.getTime()
        ) {
          throw new BadRequestException(
            ERROR_MESSAGES.BOOKING.NOT_CONSECUTIVE_TIMESLOTS,
          );
        }
      }

      const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

      const booking = await tx.booking.create({
        data: {
          customerId: customer.id,
          stylistId: stylist.id,
          salonId: dto.salonId,
          workScheduleId: dto.workScheduleId,
          totalPrice,
          status: "PENDING",
          services: {
            create: services.map((s) => ({
              serviceId: s.id,
              price: s.price,
            })),
          },
        },
      });

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
        throw new NotFoundException(ERROR_MESSAGES.BOOKING.NOT_FOUND);
      }
      const customerName = fullBooking.customer.user.fullName;
      const startTime = fullBooking.timeslots[0].timeSlot.startTime;
      const endTime =
        fullBooking.timeslots[fullBooking.timeslots.length - 1].timeSlot
          .endTime;
      const serviceNames = fullBooking.services
        .map((s) => s.service.name)
        .join(", ");
      const message = `Customer ${customerName} has booked an appointment with you on ${startTime.toLocaleDateString()} from ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Services: ${serviceNames}.`;
      const notification = await this.notificationService.createNotification(
        fullBooking.stylist.user.id,
        "New Booking ",
        message,
      );

      const unreadCount = await this.notificationService.getUnreadCount(
        fullBooking.stylist.user.id,
      );

      this.notificationGateway.sendToUser(fullBooking.stylist.user.id, {
        ...notification,
        unreadCount,
      });

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
        review: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(ERROR_MESSAGES.BOOKING.NOT_FOUND);
    }

    const role = String(user.role || "").toUpperCase();

    if (role === RoleName.ADMIN) {
    } else if (role === RoleName.CUSTOMER) {
      if (booking.customer.user.id !== user.id) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.FORBIDDEN_VIEW);
      }
    } else if (role === RoleName.STYLIST) {
      if (booking.stylist.user.id !== user.id) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.FORBIDDEN_VIEW);
      }
    } else if (role === RoleName.MANAGER) {
      const managerSalon = await this.prisma.manager.findFirst({
        where: { id: user.id },
        select: { salonId: true },
      });

      if (!managerSalon) {
        throw new ForbiddenException(ERROR_MESSAGES.MANAGER.SALON_NOT_FOUND);
      }

      if (booking.salon.id !== managerSalon.salonId) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.FORBIDDEN_VIEW);
      }
    } else {
      throw new ForbiddenException(ERROR_MESSAGES.BOOKING.FORBIDDEN_VIEW);
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
        throw new ForbiddenException(ERROR_MESSAGES.MANAGER.SALON_NOT_FOUND);
      }

      where.salonId = managerSalon.salonId;
    } else if (role !== RoleName.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.BOOKING.FORBIDDEN_VIEW);
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
          review: {
            select: {
              id: true,
              rating: true,
              content: true,
              createdAt: true,
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
        customer: {
          include: { user: true },
        },
        stylist: true,
        timeslots: {
          include: { timeSlot: true },
          orderBy: { timeSlot: { startTime: "asc" } },
          take: 1,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(ERROR_MESSAGES.BOOKING.NOT_FOUND);
    }

    if (user.role === RoleName.CUSTOMER) {
      if (booking.customer.userId !== user.id) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.NOT_OWNER);
      }
      if (booking.status !== BookingStatus.PENDING) {
        throw new BadRequestException(
          ERROR_MESSAGES.BOOKING.ONLY_PENDING_CAN_CANCEL,
        );
      }

      const firstSlot = booking.timeslots[0]?.timeSlot;
      if (!firstSlot) {
        throw new BadRequestException(ERROR_MESSAGES.BOOKING.NO_TIMESLOT);
      }

      const newStatus = getCancelStatus(firstSlot.startTime, 3);

      const customerName = booking.customer.user.fullName;
      const startTime = firstSlot.startTime;
      const endTime =
        booking.timeslots[booking.timeslots.length - 1].timeSlot.endTime;

      const message = `Customer ${customerName} đã hủy booking vào ${startTime.toLocaleDateString()} từ ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} đến ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;

      const notification = await this.notificationService.createNotification(
        booking.stylist.userId,
        "Booking Cancelled",
        message,
      );

      const unreadCount = await this.notificationService.getUnreadCount(
        booking.stylist.userId,
      );

      this.notificationGateway.sendToUser(booking.stylist.userId, {
        ...notification,
        unreadCount,
      });

      return await customerUpdateStatusBooking(
        this.prisma,
        booking.id,
        booking.customerId,
        booking.customer.userId,
        newStatus,
      );
    }
    if (user.role === "STYLIST") {
      if (booking.stylist.userId !== user.id) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.NOT_OWNER);
      }
      if (
        ![BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(dto.status)
      ) {
        throw new BadRequestException(
          ERROR_MESSAGES.BOOKING.INVALID_STATUS_FOR_STYLIST,
        );
      }
      const firstSlot = booking.timeslots[0]?.timeSlot;
      if (!firstSlot) {
        throw new BadRequestException(ERROR_MESSAGES.BOOKING.NO_TIMESLOT);
      }

      if (dto.status === BookingStatus.COMPLETED) {
        return stylistUpdateStatusBooking(
          this.prisma,
          booking.id,
          booking.customerId,
          booking.customer.userId,
          BookingStatus.COMPLETED,
        );
      }

      const newStatus = getCancelStatus(firstSlot.startTime, 3);

      return stylistUpdateStatusBooking(
        this.prisma,
        booking.id,
        booking.customerId,
        booking.customer.userId,
        newStatus,
      );
    }

    throw new ForbiddenException(
      ERROR_MESSAGES.BOOKING.ROLE_NOT_ALLOWED_UPDATE_STATUS,
    );
  }

  async reviewBooking(bookingId: string, userId: string, dto: CreateReviewDto) {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { userId },
      });

      if (!customer) {
        throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND);
      }

      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new NotFoundException(ERROR_MESSAGES.BOOKING.NOT_FOUND);
      }

      if (booking.customerId !== customer.id) {
        throw new ForbiddenException(ERROR_MESSAGES.BOOKING.NOT_OWNER);
      }

      if (booking.status !== "COMPLETED") {
        throw new BadRequestException(ERROR_MESSAGES.BOOKING.NOT_COMPLETED);
      }

      const existed = await tx.review.findUnique({
        where: { bookingId },
      });
      if (existed) {
        throw new BadRequestException(ERROR_MESSAGES.BOOKING.ALREADY_REVIEWED);
      }

      const review = await tx.review.create({
        data: {
          bookingId,
          customerId: customer.id,
          stylistId: booking.stylistId,
          rating: dto.rating,
          content: dto.content,
        },
      });

      const stats = await tx.review.aggregate({
        where: { stylistId: booking.stylistId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.stylist.update({
        where: { id: booking.stylistId },
        data: {
          rating: stats._avg.rating || 0,
          ratingCount: stats._count.rating,
        },
      });

      return review;
    });
  }
}
