import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(data: { userId: string }) {
    return this.prisma.customer.create({
      data: {
        userId: data.userId,
        totalCompleted: 0,
        totalCancelled: 0,
        totalSpending: 0,
      },
      include: {
        memberTier: true,
      },
    });
  }
}
