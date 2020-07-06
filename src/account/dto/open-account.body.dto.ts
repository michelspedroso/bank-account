import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountTypes } from './../../account/etc/type';

export class OpenAccounBodytDto {
  @ApiProperty({ enum: AccountTypes, default: AccountTypes.Current })
  type: AccountTypes;
}
