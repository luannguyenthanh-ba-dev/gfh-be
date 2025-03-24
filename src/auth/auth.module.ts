import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UsersResolver } from "./users/users.resolver";
import { UsersService } from "./users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "./users/entities/users.entity";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UsersEntity])],
  providers: [AuthService, AuthResolver, UsersResolver, UsersService],
})
export class AuthModule {}
