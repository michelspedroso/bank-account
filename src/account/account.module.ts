import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountService } from './account.service';
import { AccountRepository } from './model/account.repository';
import { AccountController } from './account.controller';
import { UserService } from './../user/user.service';
import { UserRepository } from './../user/model/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountRepository,
      UserRepository,
    ]),
  ],
  exports: [AccountService],
  providers: [
    AccountService,
    UserService,
  ],
  controllers: [AccountController],
})
export class AccountModule {}
