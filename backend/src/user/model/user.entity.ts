import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './../../config/mysql/base-entity';
import { AccountEntity } from './../../account/model/account.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String, default: 'Michel' })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String, default: 'Pedroso' })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ type: String, default: 'michelspedroso@gmail.com' })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String, default: 'password123' })
  password: string;

  @OneToMany(
    type => AccountEntity,
    accounts => accounts.user
  )
  accounts: AccountEntity[];
}
