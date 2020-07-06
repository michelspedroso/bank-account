import { Entity, OneToOne, JoinColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './../../config/mysql/base-entity';
import { UserEntity } from './../../user/model/user.entity';
import { AccountEntity } from './../../account/model/account.entity';
import { RecordTypes } from '../etc/types';

@Entity({ name: 'record' })
export class RecordEntity extends BaseEntity {
  @Column({ type: 'enum', enum: RecordTypes })
  @ApiProperty({ enum: RecordTypes, required: true })
  type: RecordTypes;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ type: Number, required: true })
  balance: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ type: Number, required: true })
  value: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({})
  user: UserEntity;

  @ManyToOne(() => AccountEntity, { nullable: true })
  @JoinColumn({})
  fromAccount: AccountEntity | null;

  @ManyToOne(() => AccountEntity, {  })
  @JoinColumn()
  toAccount: AccountEntity;
}
