import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BOOT } from '@nestcloud/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boot } from '@nestcloud/boot';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IJwtConfig } from './../config/types/jwt';
import { UserRepository } from './model/user.repository';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';
import { JwtGuard } from './guard/jwt.guard';

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
    }),
  ],
  providers: [
    UserService, 
    JwtService,
    JwtStrategy, 
    LocalStrategy, 
    JwtGuard,
  ],
  controllers: [UserController]
})
export class UserModule { }
