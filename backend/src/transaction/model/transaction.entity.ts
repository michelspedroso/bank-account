import { Entity } from 'typeorm';

import { BaseEntity } from '../../config/mysql/base-entity';

@Entity({ name: 'transaction' })
export class TransactionEntity extends BaseEntity {
}
