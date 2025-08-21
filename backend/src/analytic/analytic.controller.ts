import { Controller, Get, ForbiddenException, Query } from "@nestjs/common";
import { AnalyticService } from "./analytic.service";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AnalyticsQueryDto } from "./dtos/analytic-request.dto";
import { RoleName } from "../common/enums/role-name.enum";
import { Roles } from "../common/decorators/roles.decorator";
import { ERROR_MESSAGES } from "src/common/constants/error.constants";

@Controller("analytics")
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}
  @Get()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  async getAnalytics(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ) {
    if (user.role === RoleName.ADMIN) {
      return this.analyticService.getAdminAnalytics(user, query);
    } else if (user.role === RoleName.MANAGER) {
      return this.analyticService.getManagerAnalytics(user, query);
    } else {
      throw new ForbiddenException(ERROR_MESSAGES.ROLE.YOU_ARE_NOT_ADMIN);
    }
  }
}
