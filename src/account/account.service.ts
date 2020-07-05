import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';

import { UserEntity } from './../user/model/user.entity';
import { AccountTypes } from './etc/type';
import { AccountRepository } from './model/account.repository';
import { AccountEntity } from './model/account.entity';
import { IUserJwt } from './../user/etc/types';
import { UserService } from './../user/user.service';
import { OpenAccountDto } from './dto/open-account.dto';
import { ER_ACCOUNT_DUP_ENTRY } from 'src/user/etc/constants';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class AccountService {
    
    constructor(
        @InjectRepository(AccountRepository)
        private readonly accountRepository: AccountRepository,
        private readonly userService: UserService,
      ) {}

    generateAccountNumber(): string {
        const numberAccount = Math.floor(Math.random() * 1000000);
        const digit = Math.floor(Math.random() * 10) + 1;
        return `${numberAccount}-${digit}`;
    }

    async getAccountByUserAndType(user: UserEntity, type: AccountTypes): Promise<AccountEntity | undefined> {
        return await this.accountRepository.findOne({ user, type });
    }
    
    @Transactional()
    async create(jwt: IUserJwt, body: OpenAccountDto): Promise<AccountEntity> {
        const user = await this.userService.getUserById(jwt.sub);
        const account = await this.getAccountByUserAndType(user, body.type);

        if (account) {
            throw new ConflictException(ER_ACCOUNT_DUP_ENTRY);
        }

        const cc = this.generateAccountNumber();
        return await this.accountRepository.save({ user, cc, type: body.type });
    }
}