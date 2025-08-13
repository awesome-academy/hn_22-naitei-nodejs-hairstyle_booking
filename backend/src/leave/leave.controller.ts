import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/role-name.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DayOffResponseDto } from './dto/day-off-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.STYLIST) 
@Controller('leaves') 
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  async getMyDayOffRequests(@CurrentUser() user: JwtPayload): Promise<DayOffResponseDto[]> {
    return this.leaveService.getMyDayOffRequests(user.id, user.role);
  }
}