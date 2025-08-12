import { Controller } from "@nestjs/common";
import { Get, Post, Body, Param, Query } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getSchedules(@Query("stylistId") stylistId: string) {
    return this.scheduleService.getSchedulesOfStylist(stylistId);
  }
}
