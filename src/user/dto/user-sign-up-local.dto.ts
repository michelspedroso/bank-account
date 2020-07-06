import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserLocalBody } from '../etc/types';

export class UserSignUpDto implements IUserLocalBody {
  @IsString()
  @IsNotEmpty({ message: 'First name should not be empty' })
  @ApiProperty({ example: 'Michel' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name should not be empty' })
  @ApiProperty({ example: 'Pedroso' })
  lastName: string;

  @IsEmail(undefined, { message: 'User name must be an email' })
  @ApiProperty({ example: 'michelspedroso@gmail.com' })
  username: string;

  @IsString()
  @Length(8, 128, { message: 'Password must have at least 8 characters' })
  @ApiProperty({ example: 'password1234' })
  password: string;
}
