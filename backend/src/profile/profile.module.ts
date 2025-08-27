import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";
import { ProfileService } from "./profile.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CustomerModule } from "src/customer/customer.module";
import { StylistModule } from "src/stylist/stylist.module";
import { ManagerModule } from "src/manager/manager.module";

@Module({
  imports: [
    AuthModule,
    CustomerModule,
    StylistModule,
    ManagerModule,
    CloudinaryModule,
  ],
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
