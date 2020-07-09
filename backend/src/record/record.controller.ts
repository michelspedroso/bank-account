import { Controller, Query, UseGuards, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { RecordService } from './record.service';
import { Jwt } from './../user/etc/decorators';
import { IUserJwt } from './../user/etc/types';
import { GetExtractDto } from './dto/get-extract-query.dto';
import { JwtGuard } from './../user/guard/jwt.guard';
import { PriceInterceptor } from './../config/middlewares/price.interceptor';
import { RecordEntity } from './model/record.entity';

@Controller('record')
@ApiTags('record')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(PriceInterceptor)
export class RecordController {
    constructor(private readonly recordService: RecordService) {}

    @Get('extract')
    @ApiOkResponse({ type: RecordEntity, isArray: true })
    async getExtract(@Jwt() jwt: IUserJwt, @Query() query: GetExtractDto): Promise<RecordEntity[]> {
        return await this.recordService.getExtract(jwt, query);
    }
}
