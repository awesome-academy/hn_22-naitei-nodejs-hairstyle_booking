import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';

@Module({
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
