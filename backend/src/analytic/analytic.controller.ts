import { Controller, Get, ForbiddenException } from "@nestjs/common";
import { AnalyticService } from "./analytic.service";
import { JwtPayload } from "../common/types/jwt-payload.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RoleName } from "../common/enums/role-name.enum";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticService: AnalyticService) {}
  @Get()
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    if (user.role === RoleName.ADMIN) {
      return this.analyticService.getAdminAnalytics(user.id);
    }

    if (user.role === RoleName.MANAGER) {
      return this.analyticService.getManagerAnalytics(user.id);
    }

    throw new ForbiddenException("Unauthorized");
  }
}
