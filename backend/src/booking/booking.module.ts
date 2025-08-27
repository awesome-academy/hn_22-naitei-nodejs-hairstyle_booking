import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
