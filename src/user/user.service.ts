import * as bcrypt from 'bcrypt';

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserSignUpDto } from './dto/user-sign-up-local.dto';
import { UserRepository } from './model/user.repository';
import { UserEntity } from './model/user.entity';
import { IUserJwt } from './etc/types';
import { createJwtPayload } from './etc/utils';
import { ER_USER_DUP_ENTRY } from './etc/constants';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class UserService {
    private readonly defaultRelations = [
        'account'
    ];

    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    private async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 9);
    }

    async getUserById(id: string): Promise<UserEntity> {
        return await this.userRepository.findOneOrFail(id,
            {
                select: ['firstName', 'lastName', 'username', 'id'],
                relations: this.defaultRelations
            }
        );
    }

    async getUserByUsername(username: string): Promise<UserEntity> {
        return await this.userRepository.findOneOrFail({ where: { username }, relations: this.defaultRelations });
    }

    @Transactional()
    async signUpLocal(body: UserSignUpDto) {
        let user = await this.userRepository.findOne({ username: body.username });

        if (user) {
            throw new ConflictException(ER_USER_DUP_ENTRY)
        }

        user = await this.userRepository.save(body);
        body.password = await this.hash(body.password);
        const jwt = createJwtPayload(user);
        const accessToken = await this.jwtService.signAsync(jwt);
        return {
            user,
            accessToken,
        }
    }

    async signIn(jwt: IUserJwt) {
        const [user, accessToken] = await Promise.all([
            this.userRepository.findOneOrFail({ where: { id: jwt.sub } }),
            this.jwtService.signAsync(jwt),
        ]);
        return {
            accessToken,
            user,
        };
    }
}
