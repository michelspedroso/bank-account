import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException
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
import { ER_ACCOUNT_NOT_FOUND, ER_INVALID_CPF, ER_INVALID_OPERATION } from './etc/constants';
import { RecordTypes } from './../record/etc/types';
import { RecordService } from './../record/record.service';
import { RecordEntity } from './../record/model/record.entity';
import { RecordRepository } from './../record/model/record.repository';
import { RefundBodyDto } from './dto/refund.body.dto';
import { TransferBodyDto } from './dto/transfer.body.dto';
import { relative } from 'path';

@Injectable()
export class AccountService {
  private readonly defaultRelations = ['user'];

  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,
    private readonly userService: UserService,
    private readonly recordService: RecordService
  ) { }

  getAccountTypes() {
    return Object.values(AccountTypes);
  }

  async getAccountsByUser(jwt: IUserJwt): Promise<AccountEntity[]> {
    const user = await this.userService.getUserById(jwt.sub);
    return await this.accountRepository.find({ where: { user }, relations: ['user'] });
  }

  generateAccountNumber(): string {
    const numberAccount = Math.floor(Math.random() * 899999 + 100000);
    const digit = Math.floor(Math.random() * 10) + 1;
    return `${numberAccount}-${digit}`;
  }

  async getAccountByUserAndTypeAndCpf(
    user: UserEntity,
    type: AccountTypes,
    cpf: string,
  ): Promise<AccountEntity | undefined> {
    return await this.accountRepository.findOne({ user, type, cpf });
  }

  async saveRecord(record: RecordEntity) {
    return await this.recordService.create(record);
  }

  async isValidCpf(cpf: string) {
    return true;
  }

  async getAccountByNumber(accountNumber: string, user?: UserEntity): Promise<AccountEntity> {
    const where: { cc: string, user?: UserEntity } = { cc: accountNumber };

    if (user) {
      where.user = user;
    }

    const toAccount = await this.accountRepository.findOne({where, relations: ['user']});
    if (!toAccount) {
      throw new NotFoundException(ER_ACCOUNT_NOT_FOUND);
    }
    return toAccount;
  }

  async getAccountByUser(user: UserEntity): Promise<AccountEntity> {
    return await this.accountRepository.findOneOrFail({ user });
  }

  @Transactional()
  async create(
    jwt: IUserJwt,
    body: OpenAccounBodytDto
  ): Promise<AccountEntity> {
    const user = await this.userService.getUserById(jwt.sub);

    const isValidCpf = await this.isValidCpf(body.cpf);
    if (!isValidCpf) {
      throw new BadRequestException(ER_INVALID_CPF);
    }

    const account = await this.getAccountByUserAndTypeAndCpf(user, body.type, body.cpf);
    if (account) {
      throw new ConflictException(ER_ACCOUNT_DUP_ENTRY);
    }

    const cc = this.generateAccountNumber();
    return await this.accountRepository.save({ ...body, user, cc });
  }

  @Transactional()
  async applyDeposit(jwt: IUserJwt, body: DepositBodyDto): Promise<AccountEntity> {
    const user = await this.userService.getUserById(jwt.sub);
    const toAccount = await this.getAccountByNumber(body.toAccountNumber, user);

    const value = BalenceUtils.add(toAccount.balance, body.value);

    await Promise.all([
      this.accountRepository.save({ ...toAccount, balance: value }),
      this.saveRecord({
        user,
        toAccount,
        balance: toAccount.balance,
        value: body.value,
        type: RecordTypes.Deposit
      } as RecordEntity),
    ]);

    return await this.getAccountByUser(user);
  }

  @Transactional()
  async applyRefund(jwt: IUserJwt, body: RefundBodyDto) {
    const user = await this.userService.getUserById(jwt.sub);
    const toAccount = await this.getAccountByNumber(body.toAccountNumber);

    const value = BalenceUtils.subtract(toAccount.balance, body.value);
    await Promise.all([
      this.accountRepository.save({ ...toAccount, balance: value }),
      this.saveRecord({
        user,
        toAccount,
        balance: toAccount.balance,
        value: body.value,
        type: RecordTypes.Refund
      } as RecordEntity),
    ]);

    return await this.getAccountByUser(user);
  }

  @Transactional()
  async applyTransfer(jwt: IUserJwt, body: TransferBodyDto): Promise<AccountEntity> {
    const user = await this.userService.getUserById(jwt.sub);
    const [toAccount, fromAccount] = await Promise.all([
      this.getAccountByNumber(body.toAccountNumber),
      this.getAccountByNumber(body.fromAccountNumber, user),
    ]);
    
    const fromValue = BalenceUtils.subtract(fromAccount.balance, body.value);
    const toValue = BalenceUtils.add(toAccount.balance, body.value);

    await Promise.all([
      this.accountRepository.save({ ...fromAccount, balance: fromValue }),
      this.accountRepository.save({ ...toAccount, balance: toValue }),
      this.saveRecord({
        user,
        toAccount,
        fromAccount,
        balance: toValue,
        value: body.value,
        type: RecordTypes.TransferReceived
      } as RecordEntity),
      this.saveRecord({
        user: toAccount.user,
        toAccount: fromAccount,
        fromAccount: toAccount,
        balance: toValue,
        value: body.value,
        type: RecordTypes.TransferDelivered
      } as RecordEntity)
    ]);

    return await this.getAccountByUser(user);
  }
}
