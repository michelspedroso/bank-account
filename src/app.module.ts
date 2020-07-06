import * as path from 'path';

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { CoreModule } from './core.module';

@Module({
  imports: [CoreModule, UserModule, AccountModule],
  controllers: [],
  providers: []
})
export class AppModule {}
