import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IsBankAccount } from './../../account/etc/decorators';

export class GetExtractDto {
  @IsBankAccount()
  @IsString()
  @ApiProperty({ type: String, example: '123456-5' })
  cc: string;
}
