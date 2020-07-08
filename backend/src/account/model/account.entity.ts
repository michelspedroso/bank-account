import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './../../config/mysql/base-entity';
import { UserEntity } from './../../user/model/user.entity';
import { AccountTypes } from '../etc/type';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: AccountTypes,
    nullable: false,
    default: AccountTypes.Current
  })
  @ApiProperty({
    enum: AccountTypes,
    required: false,
    default: AccountTypes.Current
  })
  type: AccountTypes;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({ type: String, default: true, example: '1234567-8' })
  cc: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  @ApiProperty({ type: String, default: true, example: '1233212367' })
  cpf: string;

  @Column({ type: Number, nullable: false, default: 0 })
  @ApiProperty({ type: Number, default: 230 })
  balance: number;

  formattedBalance: string;

  @ManyToOne(
    type => UserEntity,
    user => user.accounts
  )
  user: UserEntity;
}
