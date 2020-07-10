import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RecordRepository } from './model/record.repository';
import { RecordEntity } from './model/record.entity';
import { IUserJwt } from './../user/etc/types';
import { GetExtractDto } from './dto/get-extract-query.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UserRepository } from './../user/model/user.repository';
import { AccountRepository } from './../account/model/account.repository';
import { AccountEntity } from './../account/model/account.entity';
import { ER_RECORDS_NOT_FOUND } from './etc/constants';
import { TransactionRepository } from './../transaction/model/transaction.repository';

@Injectable()
export class RecordService {
    private readonly defaultRelations = ['user', 'toAccount', 'fromAccount', 'toAccount.user', 'transaction'];
    constructor(
        @InjectRepository(RecordRepository)
        private readonly recordRepository: RecordRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(AccountRepository)
        private readonly accountRepository: AccountRepository,
        @InjectRepository(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
    ) { }

    async getRecords(account: AccountEntity): Promise<RecordEntity[]> {
        return await this.recordRepository.find({ where: { toAccount: account }, relations: this.defaultRelations });
    }

    async create(record: RecordEntity): Promise<RecordEntity> {
        const transaction = await this.transactionRepository.save({});
        record.transaction = transaction;
        return await this.recordRepository.save(record);
    }

    @Transactional()
    async getExtract(jwt: IUserJwt, query: GetExtractDto): Promise<RecordEntity[]> {
        const user = await this.userRepository.findOneOrFail({ id: jwt.sub });
        let account: AccountEntity | null;
        try {
            account = await this.accountRepository.findOneOrFail({ user, cc: query.cc });
        } catch (err) {
            throw new NotFoundException(ER_RECORDS_NOT_FOUND);
        }

        return await this.getRecords(account);
    }
}
