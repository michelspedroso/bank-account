import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDto {
  @IsEmail(undefined, { message: 'User name must be an email' })
  @ApiProperty({ example: 'michelspedroso@gmail.com' })
  username: string;

  @IsString()
  @Length(8, 36, { message: 'Password must have at least 8 characters' })
  @ApiProperty({ example: 'password1234' })
  password: string;
}
