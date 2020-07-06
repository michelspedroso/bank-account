import { EntityRepository } from 'typeorm';

import { BaseRepository } from './../../config/mysql/base-repository';
import { AccountEntity } from './account.entity';

@EntityRepository(AccountEntity)
export class AccountRepository extends BaseRepository<AccountEntity> {}
