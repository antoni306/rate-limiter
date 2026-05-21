import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';
import { ApiKey } from 'src/entities/ApiKey.entity';
import { FixedWindowService } from 'src/fixed-window/fixed-window.service';
import { CheckRateLimitDto } from 'src/types/dtoTypes';

@UseGuards(ApiKeyGuard)
@Controller('rate-limit')
export class RateLimitController {
    constructor(private fixedWindowService:FixedWindowService){}
    @Post('check')
    check(@Body() checkRateLimitDto:CheckRateLimitDto,@Req() req:Request&{apiKey:ApiKey}){
        return this.fixedWindowService.check(req.apiKey.keyHash,checkRateLimitDto.identifier,checkRateLimitDto.limit,checkRateLimitDto.windowSeconds);
    }
}
