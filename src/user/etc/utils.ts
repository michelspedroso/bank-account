import { UserEntity } from '../model/user.entity';
import { IUserJwt } from './types';

export function createJwtPayload(user: UserEntity): IUserJwt {
  return {
    sub: user.id,
    username: user.username
  };
}
