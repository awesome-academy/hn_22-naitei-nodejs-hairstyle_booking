import { PrismaService } from "src/prisma/prisma.service";
import { ListUserResponseDto } from "../dtos/user/user-response.dto";
import { ListCustomerResponseDto } from "../../customer/dtos/customer-response.dto";
import { ListStylistResponseDto } from "../../stylist/dto/stylist-response.dto";
import { ListManagerResponseDto } from "../../manager/dtos/manager-response.dto";
import {
  buildUserResponse,
  buildCustomerResponse,
  buildStylistResponse,
  buildManagerResponse,
} from "./response-builder";

export async function getAllUsers(
  prisma: PrismaService,
  skip = 0,
  limit = 20,
  page = 1,
): Promise<ListUserResponseDto> {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: {
        role: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  const data = users.map((user) =>
    buildUserResponse({
      ...user,
      role: user.role,
    }),
  );

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function getCustomers(
  prisma: PrismaService,
  skip = 0,
  limit = 20,
  page = 1,
): Promise<ListCustomerResponseDto> {
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      include: {
        user: { include: { role: true } },
        memberTier: true,
      },
      skip,
      take: limit,
    }),
    prisma.customer.count(),
  ]);

  return {
    data: customers.map((c) =>
      buildCustomerResponse(c.user, {
        totalCompleted: c.totalCompleted,
        totalCancelled: c.totalCancelled,
        totalSpending: c.totalSpending,
        memberTier: c.memberTier,
      }),
    ),
    total,
    page,
    limit,
  };
}

export async function getStylists(
  prisma: PrismaService,
  skip = 0,
  limit = 20,
  page = 1,
): Promise<ListStylistResponseDto> {
  const [stylists, total] = await Promise.all([
    prisma.stylist.findMany({
      include: {
        user: { include: { role: true } },
        salon: true,
      },
      skip,
      take: limit,
    }),
    prisma.stylist.count(),
  ]);

  return {
    data: stylists.map((s) =>
      buildStylistResponse(s.user, {
        salonId: s.salon.id,
        rating: s.rating,
        ratingCount: s.ratingCount,
      }),
    ),
    total,
    page,
    limit,
  };
}

export async function getManagers(
  prisma: PrismaService,
  skip = 0,
  limit = 20,
  page = 1,
): Promise<ListManagerResponseDto> {
  const [managers, total] = await Promise.all([
    prisma.manager.findMany({
      include: {
        user: { include: { role: true } },
        salon: true,
      },
      skip,
      take: limit,
    }),
    prisma.manager.count(),
  ]);

  return {
    data: managers.map((m) =>
      buildManagerResponse(m.user, { salonId: m.salonId }),
    ),
    total,
    page,
    limit,
  };
}
