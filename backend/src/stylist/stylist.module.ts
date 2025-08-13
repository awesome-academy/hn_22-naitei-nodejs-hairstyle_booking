import { Module, forwardRef } from "@nestjs/common";
import { StylistService } from "./stylist.service";
import { StylistController } from "./stylist.controller";
import { PrismaService } from "../prisma/prisma.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [StylistController],
  providers: [StylistService, PrismaService],
  exports: [StylistService],
})
export class StylistModule {}
