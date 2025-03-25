import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmiEntity } from './entities/bmi.entity';
import { BmiService } from './bmi.service';
import { BmiResolver } from './bmi.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BmiEntity]),
    AuthModule
  ],
  providers: [BmiService, BmiResolver],
  exports: [BmiService]
})
export class BmiModule {} 