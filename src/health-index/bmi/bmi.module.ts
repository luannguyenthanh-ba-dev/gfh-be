import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmiEntity } from './entities/bmi.entity';
import { BmiService } from './bmi.service';
import { BmiResolver } from './bmi.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationSvcModule } from 'src/external-services/notification-service/notification-svc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BmiEntity]),
    AuthModule,
    NotificationSvcModule,
  ],
  providers: [BmiService, BmiResolver],
  exports: [BmiService],
})
export class BmiModule {} 