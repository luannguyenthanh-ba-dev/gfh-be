import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UsersResolver } from "./users/users.resolver";
import { UsersService } from "./users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "./users/entities/users.entity";
import { NotificationSvcModule } from "../external-services/notification-service/notification-svc.module";
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UsersEntity]),
    NotificationSvcModule,
  ],
  providers: [AuthService, AuthResolver, UsersResolver, UsersService],
  exports: [UsersService, HttpModule],
})
export class AuthModule {}
