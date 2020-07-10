import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserSignUpDto } from './dto/user-sign-up-local.dto';
import { LocalGuard } from './guard/local.guard';
import { Jwt } from './etc/decorators';
import { IUserJwt } from './etc/types';
import { UserEntity } from './model/user.entity';
import { JwtGuard } from './guard/jwt.guard';
import { UserSignInDto } from './dto/user-sign-in-local.dto';
import { UserSignResponseDto } from './dto/user-signin-local-response.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  @ApiOkResponse({ type: UserSignResponseDto })
  async userSignUpLocal(@Body() body: UserSignUpDto): Promise<UserSignResponseDto> {
    const { accessToken, user } = await this.userService.signUpLocal(body);
    return {
      accessToken,
      userId: user.id
    };
  }

  @Post('signin')
  @ApiBearerAuth()
  @UseGuards(LocalGuard)
  @ApiOkResponse({ type: UserSignResponseDto })
  async signin(@Jwt() jwt: IUserJwt, @Body() body: UserSignInDto): Promise<UserSignResponseDto>{
    const { accessToken, user } = await this.userService.signIn(jwt);
    return {
      accessToken,
      userId: user.id
    };
  }

  @Get('detail')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: UserEntity })
  async getUserDetail(@Jwt() jwt: IUserJwt): Promise<UserEntity> {
    return await this.userService.getUserById(jwt.sub);
  }
}
