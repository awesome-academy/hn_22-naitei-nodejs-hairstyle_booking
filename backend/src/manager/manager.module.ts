import { Module } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { ManagerController } from "./manager.controller";

@Module({
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule {}
