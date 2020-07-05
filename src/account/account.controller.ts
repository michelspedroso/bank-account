import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from './../user/guard/jwt.guard';
import { Jwt } from './../user/etc/decorators';
import { IUserJwt } from './../user/etc/types';
import { OpenAccountDto } from './dto/open-account.dto';
import { AccountService } from './account.service';

@Controller('account')
@ApiTags('account')
@ApiBearerAuth()
export class AccountController {

    constructor(private readonly accountService: AccountService) {}

    @Post('')
    @UseGuards(JwtGuard)
    async openAccount(
        @Jwt() jwt: IUserJwt,
        @Body() body: OpenAccountDto,
    ) {
        return await this.accountService.create(jwt, body);
    }
}

