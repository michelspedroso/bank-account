import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionRepository } from './model/transaction.repository';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionRepository])],
})
export class TransactionModule {}
