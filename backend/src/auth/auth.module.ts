import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerService } from "../user/customer.service";
import { jwtConstants } from "../common/constants/jwt.constants";
import { OtpService } from "../otp/otp.service";
import { EmailService } from "../email/email.service";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    }),
  ],
  providers: [AuthService, UserService, PrismaService, CustomerService, OtpService, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
