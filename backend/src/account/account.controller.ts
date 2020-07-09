import { Controller, Post, UseGuards, Body, UseInterceptors, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { JwtGuard } from './../user/guard/jwt.guard';
import { Jwt } from './../user/etc/decorators';
import { IUserJwt } from './../user/etc/types';
import { OpenAccounBodytDto } from './dto/open-account.body.dto';
import { AccountService } from './account.service';
import { AccountEntity } from './model/account.entity';
import { PaymentBodyDto } from './dto/payment.body.dto';
import { DepositBodyDto } from './dto/deposit.body.dto';
import { RefundBodyDto } from './dto/refund.body.dto';
import { TransferBodyDto } from './dto/transfer.body.dto';
import { PriceInterceptor } from './../config/middlewares/price.interceptor';

@Controller('account')
@ApiTags('account')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(PriceInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('')
  @ApiOkResponse({ type: AccountEntity })
  async openAccount(
    @Jwt() jwt: IUserJwt,
    @Body() body: OpenAccounBodytDto
  ): Promise<AccountEntity> {
    return await this.accountService.create(jwt, body);
  }

  @Get('')
  @ApiOkResponse({ type: AccountEntity, isArray: true })
  async getAccounts(@Jwt() jwt: IUserJwt): Promise<AccountEntity[]> {
    return await this.accountService.getAccountsByUser(jwt);
  }

  @Get('types')
  @ApiOkResponse({ type: String, isArray: true })
  async getAccountTypes(@Jwt() jwt: IUserJwt): Promise<string[]> {
    return await this.accountService.getAccountTypes();
  }

  @Post('deposit')
  @ApiOkResponse({ type: DepositBodyDto })
  async applyDeposit(@Jwt() jwt: IUserJwt, @Body() body: DepositBodyDto) {
    return await this.accountService.applyDeposit(jwt, body);
  }

  @Post('refund')
  @ApiOkResponse({ type: RefundBodyDto })
  async applyRefund(@Jwt() jwt: IUserJwt, @Body() body: RefundBodyDto) {
    return await this.accountService.applyRefund(jwt, body);
  }

  @Post('transfer')
  @ApiOkResponse({ type: TransferBodyDto })
  async applyTransfer(@Jwt() jwt: IUserJwt, @Body() body: TransferBodyDto) {
    return await this.accountService.applyTransfer(jwt, body);
  }
}
