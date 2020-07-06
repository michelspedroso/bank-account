import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBankAccount } from '../etc/decorators';

export class TransferBodyDto {
  @IsBankAccount()
  @IsString()
  @ApiProperty({ type: String, example: '123456-5' })
  toAccountNumber: string;

  @IsBankAccount()
  @IsString()
  @ApiProperty({ type: String, example: '123456-5' })
  fromAccountNumber: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 230422 })
  value: number;
}
