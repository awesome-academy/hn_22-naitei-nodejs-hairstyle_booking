import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";
import { ProfileService } from "./profile.service";

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [UserService, PrismaService, ProfileService],
})
export class ProfileModule {}
