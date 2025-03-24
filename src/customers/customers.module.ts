import { Module } from "@nestjs/common";
import { CustomersEntity } from "./entities/customers.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersResolver } from "./customers.resolver";
import { CustomersService } from "./customers.service";

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity])],
  providers: [CustomersResolver, CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
