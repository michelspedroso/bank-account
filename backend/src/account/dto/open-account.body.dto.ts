import { IsString, IsEnum, IsNumberString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountTypes } from './../../account/etc/type';

export class OpenAccounBodytDto {
  @IsEnum(AccountTypes)
  @ApiProperty({ enum: AccountTypes, default: AccountTypes.Current })
  type: AccountTypes;

  @IsString()
  @IsNumberString()
  @Length(11,11)
  @ApiProperty({ type: String, example: '02223412254'})
  cpf: string;
}
