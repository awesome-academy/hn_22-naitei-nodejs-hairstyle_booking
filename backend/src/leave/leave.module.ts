import { Module } from "@nestjs/common";
import { LeaveController } from "./leave.controller";
import { LeaveService } from "./leave.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationModule } from "src/notification/notification.module";

import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule, NotificationModule],
  controllers: [LeaveController],
  providers: [LeaveService, PrismaService],
})
export class LeaveModule {}
