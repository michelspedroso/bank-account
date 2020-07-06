import * as bcrypt from 'bcrypt';

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { UserSignUpDto } from './dto/user-sign-up-local.dto';
import { UserRepository } from './model/user.repository';
import { UserEntity } from './model/user.entity';
import { IUserJwt } from './etc/types';
import { createJwtPayload } from './etc/utils';
import { ER_USER_DUP_ENTRY, ER_USER_NOT_FOUND } from './etc/constants';
import { BalenceUtils } from './../account/etc/utils';

@Injectable()
export class UserService {
  private readonly defaultRelations = ['account'];

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) { }

  private async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 9);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneOrFail(id, {
      select: ['firstName', 'lastName', 'username', 'id'],
      relations: this.defaultRelations
    });

    for (const account of user.account) {
      const { formatted } = BalenceUtils.create(account.balance);
      account.formattedBalance = formatted;
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { username },
        relations: this.defaultRelations
      });
    } catch (err) {
      throw new NotFoundException(ER_USER_NOT_FOUND);
    }
  }

  @Transactional()
  async signUpLocal(body: UserSignUpDto) {
    let user = await this.userRepository.findOne({ username: body.username });

    if (user) {
      throw new ConflictException(ER_USER_DUP_ENTRY);
    }

    user = await this.userRepository.save(body);
    body.password = await this.hash(body.password);
    const jwt = createJwtPayload(user);
    const accessToken = await this.jwtService.signAsync(jwt);
    return {
      user,
      accessToken
    };
  }

  async signIn(jwt: IUserJwt) {
    const [user, accessToken] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: jwt.sub } }),
      this.jwtService.signAsync(jwt)
    ]);
    return {
      accessToken,
      user
    };
  }
}
