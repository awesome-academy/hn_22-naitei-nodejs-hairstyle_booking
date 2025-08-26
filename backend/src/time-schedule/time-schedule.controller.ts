import { Controller, Get, Param } from "@nestjs/common";
import { TimeScheduleService } from "./time-schedule.service";
import { WorkScheduleResponseDto } from "./dtos/time-schedule-response.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { Roles } from "../common/decorators/roles.decorator";
import { RoleName } from "../common/enums/role-name.enum";

@Controller("time-schedule")
export class TimeScheduleController {
  constructor(private readonly timeScheduleService: TimeScheduleService) {}

  @Roles(RoleName.STYLIST)
  @Get("me")
  async getTimeSchedules(
    @CurrentUser() user: JwtPayload,
  ): Promise<WorkScheduleResponseDto[]> {
    return this.timeScheduleService.getTimeSchedulesForStylist(user.id);
  }

  @Roles(RoleName.CUSTOMER)
  @Get(":userId")
  async getSchedulesOfStylist(@Param("userId") userId: string) {
    return this.timeScheduleService.getTimeSchedulesForCustomer(userId);
  }
}
