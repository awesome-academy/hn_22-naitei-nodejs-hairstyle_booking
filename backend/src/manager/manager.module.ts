import { Module, forwardRef } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { ManagerController } from "./manager.controller";
import { UserModule } from "../user/user.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [ManagerService, PrismaService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule {}
