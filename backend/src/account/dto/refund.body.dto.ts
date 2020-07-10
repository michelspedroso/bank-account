import { IsString, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBankAccount } from '../etc/decorators';

export class RefundBodyDto {
  @IsBankAccount()
  @IsString()
  @Length(8,8)
  @ApiProperty({ type: String, example: '123456-5' })
  toAccountNumber: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 230422 })
  value: number;
}
