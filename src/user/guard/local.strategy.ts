import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createJwtPayload } from '../etc/utils';
import { ER_PASSWORD_MISMATCH, ER_PERMISSION_DENIED } from '../etc/constants';
import { UserService } from '../user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.userService.getUserByUsername(
      username,
    );
    if (!user) {
      throw new UnauthorizedException(ER_PERMISSION_DENIED);
    }
    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.password));
    if (!isPasswordValid) {
      throw new BadRequestException(ER_PASSWORD_MISMATCH);
    }
    return createJwtPayload(user);
  }
}
