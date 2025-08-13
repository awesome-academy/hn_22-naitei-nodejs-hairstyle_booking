import { Module } from "@nestjs/common";
import { TimeScheduleController } from "./time-schedule.controller";
import { TimeScheduleService } from "./time-schedule.service";

@Module({
  controllers: [TimeScheduleController],
  providers: [TimeScheduleService],
})
export class TimeScheduleModule {}
