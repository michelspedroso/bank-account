import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordService } from './record.service';
import { RecordRepository } from './model/record.repository';
import { RecordController } from './record.controller';
import { UserRepository } from './../user/model/user.repository';
import { AccountRepository } from './../account/model/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecordRepository, UserRepository, AccountRepository])],
  exports: [RecordService],
  providers: [RecordService],
  controllers: [RecordController]
})
export class RecordModule {}
