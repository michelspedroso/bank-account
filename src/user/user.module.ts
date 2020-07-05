import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BOOT } from '@nestcloud/common';
import { Boot } from '@nestcloud/boot';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IJwtConfig } from './../config/types/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './model/user.repository';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';
import { JwtGuard } from './guard/jwt.guard';
import { AccountEntity } from './../account/model/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
    ]),
    JwtModule.registerAsync({
      inject: [BOOT],
      useFactory: (config: Boot) => {
        const { secret, expiresIn }: IJwtConfig = config.get('jwt');
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    })],
  providers: [UserService, JwtStrategy, LocalStrategy, JwtGuard],
  controllers: [UserController]
})
export class UserModule { }
