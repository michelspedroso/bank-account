import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../../config/mysql/base-repository';
import { TransactionEntity } from './transaction.entity';

@EntityRepository(TransactionEntity)
export class TransactionRepository extends BaseRepository<TransactionEntity> {
}
