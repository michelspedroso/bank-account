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

@Injectable()
export class RecordService {
    private readonly defaultRelations = ['account', 'user'];
    constructor(
        @InjectRepository(RecordRepository)
        private readonly recordRepository: RecordRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(AccountRepository)
        private readonly accountRepository: AccountRepository,
    ) { }

    async getRecords(account: AccountEntity) {
        return await this.recordRepository.findRecordByAccount(account);
    }

    async createDeposit(record: RecordEntity): Promise<RecordEntity> {
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
