import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CustomerService } from "./customer.service";

@Module({
  controllers: [UserController],
  providers: [UserService, CustomerService],
  exports: [UserService, CustomerService],
})
export class UserModule {}
