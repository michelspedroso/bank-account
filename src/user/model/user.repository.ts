import { EntityRepository } from 'typeorm';

import { BaseRepository } from './../../config/mysql/base-repository';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}