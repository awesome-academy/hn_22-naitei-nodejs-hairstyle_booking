import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CustomerService } from "../customer/customer.service";
import { StylistModule } from "../stylist/stylist.module";
import { CustomerModule } from "../customer/customer.module";
import { ManagerModule } from "../manager/manager.module";

@Module({
  imports: [
    forwardRef(() => StylistModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => ManagerModule),
  ],
  controllers: [UserController],
  providers: [UserService, CustomerService],
  exports: [UserService, CustomerService],
})
export class UserModule {}
