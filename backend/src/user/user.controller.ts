import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserSignUpDto } from './dto/user-sign-up-local.dto';
import { LocalGuard } from './guard/local.guard';
import { Jwt } from './etc/decorators';
import { IUserJwt } from './etc/types';
import { UserEntity } from './model/user.entity';
import { JwtGuard } from './guard/jwt.guard';
import { UserSignInDto } from './dto/user-sign-in-local.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async userSignUpLocal(@Body() body: UserSignUpDto) {
    const { accessToken, user } = await this.userService.signUpLocal(body);
    return {
      data: {
        accessToken,
        userId: user.id
      }
    };
  }

  @Post('signin')
  @ApiBearerAuth()
  @UseGuards(LocalGuard)
  async signin(@Jwt() jwt: IUserJwt, @Body() body: UserSignInDto) {
    const { accessToken, user } = await this.userService.signIn(jwt);
    return {
      data: {
        accessToken,
        userId: user.id
      }
    };
  }

  @Get('detail')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getUserDetail(@Jwt() jwt: IUserJwt): Promise<UserEntity> {
    return await this.userService.getUserById(jwt.sub);
  }
}
