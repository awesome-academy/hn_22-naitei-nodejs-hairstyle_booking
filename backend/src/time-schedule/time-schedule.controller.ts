import { Controller, Get } from "@nestjs/common";
import { TimeScheduleService } from "./time-schedule.service";
import { WorkScheduleResponseDto } from "./dtos/time-schedule-response.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";

@Controller("time-schedule")
export class TimeScheduleController {
  constructor(private readonly timeScheduleService: TimeScheduleService) {}

  @Get()
  async getTimeSchedules(
    @CurrentUser() user: JwtPayload,
  ): Promise<WorkScheduleResponseDto[]> {
    return this.timeScheduleService.getTimeSchedulesOfStylist(user.id);
  }
}
