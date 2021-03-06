import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordService } from './record.service';
import { RecordRepository } from './model/record.repository';
import { RecordController } from './record.controller';
import { UserRepository } from './../user/model/user.repository';
import { AccountRepository } from './../account/model/account.repository';
import { PriceInterceptor } from './../config/middlewares/price.interceptor';
import { TransactionRepository } from './../transaction/model/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecordRepository, UserRepository, AccountRepository, TransactionRepository])],
  exports: [RecordService],
  providers: [RecordService, PriceInterceptor],
  controllers: [RecordController]
})
export class RecordModule {}
