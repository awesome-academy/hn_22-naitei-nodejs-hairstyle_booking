import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService],
})
export class CustomerModule {}
