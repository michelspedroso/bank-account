import { Entity, JoinColumn, Column, ManyToOne, Generated, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './../../config/mysql/base-entity';
import { UserEntity } from './../../user/model/user.entity';
import { AccountEntity } from './../../account/model/account.entity';
import { RecordTypes } from '../etc/types';
import { TransactionEntity } from 'src/transaction/model/transaction.entity';

@Entity({ name: 'record' })
export class RecordEntity extends BaseEntity {
  @Column({ type: 'enum', enum: RecordTypes })
  @ApiProperty({ enum: RecordTypes, required: true })
  type: RecordTypes;

  @Column({ type: 'decimal', precision: 65, scale: 0, nullable: false })
  @ApiProperty({ type: Number, required: true })
  balance: number;

  formatedBalance: string;

  @Column({ type: 'decimal', precision: 65, scale: 0, nullable: false })
  @ApiProperty({ type: Number, required: true })
  value: number;

  formatedValue: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({})
  user: UserEntity;

  @ManyToOne(() => AccountEntity, { nullable: true })
  @JoinColumn({})
  fromAccount: AccountEntity | null;

  @ManyToOne(() => AccountEntity, {})
  @JoinColumn()
  toAccount: AccountEntity;

  @OneToOne(
    type => TransactionEntity,
    transaction => transaction.id,
  )
  @JoinColumn()
  transaction: TransactionEntity;
}
