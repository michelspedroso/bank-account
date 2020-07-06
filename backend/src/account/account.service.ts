import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';

import { UserEntity } from './../user/model/user.entity';
import { AccountTypes } from './etc/type';
import { AccountRepository } from './model/account.repository';
import { AccountEntity } from './model/account.entity';
import { IUserJwt } from './../user/etc/types';
import { UserService } from './../user/user.service';
import { OpenAccounBodytDto } from './dto/open-account.body.dto';
import { ER_ACCOUNT_DUP_ENTRY } from './../user/etc/constants';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PaymentBodyDto } from './dto/payment.body.dto';
import { DepositBodyDto } from './dto/deposit.body.dto';
import { BalenceUtils } from './etc/utils';
import { ER_ACCOUNT_NOT_FOUND } from './etc/constants';
import { RecordTypes } from './../record/etc/types';
import { RecordService } from './../record/record.service';
import { RecordEntity } from './../record/model/record.entity';
import { RecordRepository } from './../record/model/record.repository';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
    private readonly recordService: RecordService
  ) {}

  generateAccountNumber(): string {
    const numberAccount = Math.floor(Math.random() * 1000000);
    const digit = Math.floor(Math.random() * 10) + 1;
    return `${numberAccount}-${digit}`;
  }

  async getAccountByUserAndType(
    user: UserEntity,
    type: AccountTypes
  ): Promise<AccountEntity | undefined> {
    return await this.accountRepository.findOne({ user, type });
  }

  async saveRecord(record: RecordEntity) {
    return await this.recordService.createDeposit(record);
  }

  @Transactional()
  async create(
    jwt: IUserJwt,
    body: OpenAccounBodytDto
  ): Promise<AccountEntity> {
    const user = await this.userService.getUserById(jwt.sub);
    const account = await this.getAccountByUserAndType(user, body.type);

    if (account) {
      throw new ConflictException(ER_ACCOUNT_DUP_ENTRY);
    }

    const cc = this.generateAccountNumber();
    return await this.accountRepository.save({ user, cc, type: body.type });
  }

  @Transactional()
  async applyPayment(jwt: IUserJwt, body: PaymentBodyDto) {
    return true;
  }

  @Transactional()
  async applyDeposit(jwt: IUserJwt, body: DepositBodyDto) {
    const user = await this.userService.getUserById(jwt.sub);

    const toAccount = await this.accountRepository.findOne({
      cc: body.accountNumber
    });
    if (!toAccount) {
      throw new NotFoundException(ER_ACCOUNT_NOT_FOUND);
    }

    toAccount.balance += body.value;
    await this.accountRepository.save(toAccount);

    const { formatted } = BalenceUtils.create(toAccount.balance);

    await this.saveRecord({
      user,
      toAccount,
      balance: toAccount.balance,
      value: body.value,
      type: RecordTypes.Deposit
    } as RecordEntity);

    return {
      accountNumber: body.accountNumber,
      valueFormatted: formatted
    };
  }
}
