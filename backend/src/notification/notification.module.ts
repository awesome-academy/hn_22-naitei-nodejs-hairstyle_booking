import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
  ],
})
export class NotificationModule {}