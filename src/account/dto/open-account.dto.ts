import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountTypes } from 'src/account/etc/type';

export class OpenAccountDto {
    @ApiProperty({ enum: AccountTypes, default: AccountTypes.Current })
    type: AccountTypes;
}
