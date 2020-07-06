import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../../config/mysql/base-repository';
import { RecordEntity } from './record.entity';
import { AccountEntity } from './../../account/model/account.entity';

@EntityRepository(RecordEntity)
export class RecordRepository extends BaseRepository<RecordEntity> {
    async findRecordByAccount(account: AccountEntity) {
        return this.createQueryBuilder('record')
            .select()
            .leftJoinAndSelect('record.toAccount', 'toAccount')
            .leftJoinAndSelect('record.fromAccount', 'fromAccount')
            .leftJoinAndSelect('record.user', 'user')
            .where('toAccountId = :toAccount', { toAccount: account.id })
            .orWhere('fromAccountId = :fromAccount', { fromAccount: account.id })
            .orderBy('record.createdAt', 'DESC')
            .getMany();
    }
}
