export function handleCancelledBooking(customerId: string) {
  await this.prisma.customer.update({
    where: { id: customerId },
    data: {
      totalCancelled: { increment: 1 },
    },
  });
}
