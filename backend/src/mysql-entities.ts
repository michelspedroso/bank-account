import { UserEntity } from './user/model/user.entity';
import { AccountEntity } from './account/model/account.entity';
import { RecordEntity } from './record/model/record.entity';
import { TransactionEntity } from './transaction/model/transaction.entity';

export const MYSQL_ENTITIES = [UserEntity, AccountEntity, RecordEntity, TransactionEntity];
