import * as path from 'path';

import { Module } from '@nestjs/common';
import { BootModule, Boot } from '@nestcloud/boot';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BOOT } from '@nestcloud/common';

import { MYSQL_ENTITIES } from './mysql-entities';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    BootModule.forRoot({
      filePath: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.yaml`),
    }),
    TypeOrmModule.forRootAsync({
      inject: [BOOT],
      useFactory: (config: Boot) => {
        return {
          ...config.get('database'), entities: MYSQL_ENTITIES,
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
