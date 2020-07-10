import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountService } from './account.service';
import { AccountRepository } from './model/account.repository';
import { AccountController } from './account.controller';
import { JwtGuard } from './../user/guard/jwt.guard';
import { UserModule } from './../user/user.module';
import { RecordModule } from './../record/record.module';
import { PriceInterceptor } from './../config/middlewares/price.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    UserModule,
    RecordModule
  ],
  exports: [AccountService],
  providers: [AccountService, JwtGuard, PriceInterceptor],
  controllers: [AccountController]
})
export class AccountModule {}
