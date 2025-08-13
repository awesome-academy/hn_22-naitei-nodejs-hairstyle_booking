import { Controller } from "@nestjs/common";
import { Get, Post, Body, Param, Query } from "@nestjs/common";
import { TimeScheduleService } from "./time-schedule.service";

@Controller("schedule")
export class TimeScheduleController {
  constructor(private readonly timeScheduleService: TimeScheduleService) {}

  @Get()
  async getTimeSchedules(@Query("stylistId") stylistId: string) {
    return this.timeScheduleService.getTimeSchedulesOfStylist(stylistId);
  }
}
