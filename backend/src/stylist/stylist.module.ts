import { Module } from "@nestjs/common";
import { StylistService } from "./stylist.service";
import { StylistController } from "./stylist.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [StylistController],
  providers: [StylistService, PrismaService],
  exports: [StylistService],
})
export class StylistModule {}
