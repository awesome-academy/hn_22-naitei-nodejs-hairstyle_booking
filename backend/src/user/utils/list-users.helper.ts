import { PrismaService } from "src/prisma/prisma.service";
import { ListUserResponseDto } from "../dtos/user/user-response.dto";
import { ListCustomerResponseDto } from "../dtos/customer/customer-response.dto";
import { ListStylistResponseDto } from "../dtos/stylist/stylist-response.dto";
import { ListManagerResponseDto } from "../dtos/manager/manager-response.dto";
import {
  buildUserResponse,
  buildCustomerResponse,
  buildStylistResponse,
  buildManagerResponse,
} from "./response-builder";

export async function getAllUsers(
  prisma: PrismaService,
): Promise<ListUserResponseDto> {
  const users = await prisma.user.findMany({
    include: {
      role: true,
    },
  });

  const data = users.map((user) =>
    buildUserResponse({
      ...user,
      role: user.role,
    }),
  );

  return {
    data,
    total: data.length,
  };
}

export async function getCustomers(
  prisma: PrismaService,
): Promise<ListCustomerResponseDto> {
  const customers = await prisma.customer.findMany({
    include: {
      user: { include: { role: true } },
      memberTier: true,
    },
  });

  return {
    data: customers.map((c) =>
      buildCustomerResponse(c.user, {
        totalCompleted: c.totalCompleted,
        totalCancelled: c.totalCancelled,
        totalSpending: c.totalSpending,
        memberTier: c.memberTier,
      }),
    ),
    total: customers.length,
  };
}

export async function getStylists(
  prisma: PrismaService,
): Promise<ListStylistResponseDto> {
  const stylists = await prisma.stylist.findMany({
    include: {
      user: { include: { role: true } },
      salon: true,
    },
  });

  return {
    data: stylists.map((s) =>
      buildStylistResponse(s.user, {
        salonId: s.salon.id,
        rating: s.rating,
        ratingCount: s.ratingCount,
      }),
    ),
    total: stylists.length,
  };
}

export async function getManagers(
  prisma: PrismaService,
): Promise<ListManagerResponseDto> {
  const managers = await prisma.manager.findMany({
    include: {
      user: { include: { role: true } },
      salon: true,
    },
  });

  return {
    data: managers.map((m) =>
      buildManagerResponse(m.user, { salonId: m.salonId }),
    ),
    total: managers.length,
  };
}
