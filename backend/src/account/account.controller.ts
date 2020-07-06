import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from './../user/guard/jwt.guard';
import { Jwt } from './../user/etc/decorators';
import { IUserJwt } from './../user/etc/types';
import { OpenAccounBodytDto } from './dto/open-account.body.dto';
import { AccountService } from './account.service';
import { AccountEntity } from './model/account.entity';
import { PaymentBodyDto } from './dto/payment.body.dto';
import { DepositBodyDto } from './dto/deposit.body.dto';

@Controller('account')
@ApiTags('account')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('')
  async openAccount(
    @Jwt() jwt: IUserJwt,
    @Body() body: OpenAccounBodytDto
  ): Promise<AccountEntity> {
    return await this.accountService.create(jwt, body);
  }

  @Post('payment')
  async applyPayment(@Jwt() jwt: IUserJwt, @Body() body: PaymentBodyDto) {
    return await this.accountService.applyPayment(jwt, body);
  }

  @Post('deposit')
  async applyDeposit(@Jwt() jwt: IUserJwt, @Body() body: DepositBodyDto) {
    return await this.accountService.applyDeposit(jwt, body);
  }
}
