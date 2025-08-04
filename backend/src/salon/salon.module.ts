import { Module } from "@nestjs/common";
import { SalonService } from "./salon.service";
import { SalonController } from "./salon.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [SalonController],
  providers: [SalonService, PrismaService],
  exports: [SalonService],
})
export class SalonModule {}
