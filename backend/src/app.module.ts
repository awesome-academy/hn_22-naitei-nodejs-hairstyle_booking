import { FavoriteModule } from "./favourite/favorite.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { SalonModule } from "./salon/salon.module";
import { StylistModule } from "./stylist/stylist.module";
import { ServiceModule } from "./service/service.module";
import { CustomerModule } from "./customer/customer.module";
import { ManagerModule } from "./manager/manager.module";
import { ProfileModule } from "./profile/profile.module";
import { BookingModule } from "./booking/booking.module";
import { ScheduleModule } from "@nestjs/schedule";
import { WorkSchedulesJob } from "./jobs/work-schedules.job";
import { StatsAggregationJob } from "./jobs/stats-aggregation.job";
import { TimeScheduleModule } from "./time-schedule/time-schedule.module";
import { AnalyticModule } from "./analytic/analytic.module";
import { LeaveModule } from "./leave/leave.module";
import { NotificationModule } from "./notification/notification.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    SalonModule,
    StylistModule,
    ServiceModule,
    CustomerModule,
    ManagerModule,
    ProfileModule,
    BookingModule,
    TimeScheduleModule,
    AnalyticModule,
    LeaveModule,
    FavoriteModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    WorkSchedulesJob,
    StatsAggregationJob,
  ],
})
export class AppModule {}
