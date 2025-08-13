import { PrismaClient } from "@prisma/client";
import { BookingStatus } from "../../common/enums/booking-status.enum";

export async function customerUpdateStatusBooking(
  bookingId: string,
  customerId: string,
  userId: string,
  newStatus:
    | BookingStatus.CANCELLED
    | BookingStatus.CANCELLED_EARLY
    | BookingStatus.CANCELLED_DAYOFF,
) {
  return this.prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      select: { id: true, totalPrice: true },
    });

    const CANCEL_STATUSES = [
      BookingStatus.CANCELLED,
      BookingStatus.CANCELLED_EARLY,
      BookingStatus.CANCELLED_DAYOFF,
    ] as const;

    if (CANCEL_STATUSES.includes(newStatus)) {
      const slotIds = await tx.bookingTimeslot.findMany({
        where: { bookingId },
        select: { timeSlotId: true },
      });

      if (slotIds.length > 0) {
        await tx.timeSlot.updateMany({
          where: { id: { in: slotIds.map((s) => s.timeSlotId) } },
          data: { isBooked: false },
        });
      }
    }

    if (newStatus === BookingStatus.CANCELLED) {
      await tx.customer.update({
        where: { id: customerId },
        data: { totalCancelled: { increment: 1 } },
      });
    }

    // Chỗ này không thể có completed trong kiểu newStatus của customerUpdateStatusBooking
    // nên nếu muốn handle completed thì tách riêng hàm khác hoặc sửa kiểu

    const customer = await tx.customer.findUnique({
      where: { id: customerId },
      select: { totalCancelled: true, totalCompleted: true },
    });

    if (!customer) {
      throw new Error("Customer not found after update");
    }

    const diff = customer.totalCancelled - customer.totalCompleted;
    if (diff === -10) {
      await tx.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    }

    return { message: `Booking updated to ${newStatus}` };
  });
}

export async function stylistUpdateStatusBooking(
  bookingId: string,
  customerId: string,
  userId: string,
  newStatus:
    | BookingStatus.CANCELLED
    | BookingStatus.CANCELLED_EARLY
    | BookingStatus.CANCELLED_DAYOFF
    | BookingStatus.COMPLETED,
) {
  return this.prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      select: { id: true, totalPrice: true },
    });

    const CANCEL_STATUSES = [
      BookingStatus.CANCELLED,
      BookingStatus.CANCELLED_EARLY,
      BookingStatus.CANCELLED_DAYOFF,
    ] as const;

    if (CANCEL_STATUSES.includes(newStatus as any)) {
      const slotIds = await tx.bookingTimeslot.findMany({
        where: { bookingId },
        select: { timeSlotId: true },
      });

      if (slotIds.length > 0) {
        await tx.timeSlot.updateMany({
          where: { id: { in: slotIds.map((s) => s.timeSlotId) } },
          data: { isBooked: false },
        });
      }
    }

    if (newStatus === BookingStatus.CANCELLED) {
      await tx.customer.update({
        where: { id: customerId },
        data: { totalCancelled: { increment: 1 } },
      });
    }

    if (newStatus === BookingStatus.COMPLETED) {
      await tx.customer.update({
        where: { id: customerId },
        data: {
          totalCompleted: { increment: 1 },
          totalSpending: { increment: updated.totalPrice ?? 0 },
        },
      });
    }

    const customer = await tx.customer.findUnique({
      where: { id: customerId },
      select: { totalCancelled: true, totalCompleted: true },
    });

    if (!customer) {
      throw new Error("Customer not found after update");
    }

    const diff = customer.totalCancelled - customer.totalCompleted;
    if (diff === -10) {
      await tx.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    }

    return { message: `Booking updated to ${newStatus}` };
  });
}
