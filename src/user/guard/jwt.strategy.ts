import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IUserJwt } from '../etc/types';
import { InjectBoot, Boot } from '@nestcloud/boot';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectBoot() private readonly boot: Boot) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: boot.get<string>('jwt.secret')
    });
  }

  async validate(req: Request, payload: IUserJwt): Promise<IUserJwt> {
    return payload;
  }
}
