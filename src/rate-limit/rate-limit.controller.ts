import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';
import { ApiKey } from 'src/entities/ApiKey.entity';
import { FixedWindowService } from 'src/fixed-window/fixed-window.service';
import { SlidingLogService } from 'src/sliding-log/sliding-log.service';
import { SlidingWindowCounterService } from 'src/sliding-window-counter/sliding-window-counter.service';
import { TokenBucketService } from 'src/token-bucket/token-bucket.service';
import { CheckRateLimitDto } from 'src/types/dtoTypes';

@UseGuards(ApiKeyGuard)
@Controller('rate-limit')
export class RateLimitController {
    constructor(private fixedWindowService:FixedWindowService,
                private slidingLogService:SlidingLogService,
                private tokenBucketService: TokenBucketService,
                private slidingWindowCounter:SlidingWindowCounterService
    ){}
    @Post('check')
    check(@Body() checkRateLimitDto:CheckRateLimitDto,@Req() req:Request&{apiKey:ApiKey}){
        return this.fixedWindowService.check(req.apiKey.keyHash,checkRateLimitDto.identifier,checkRateLimitDto.limit,checkRateLimitDto.windowSeconds);
    }
    @Post('check/sliding-log')
    checkSlidingLog(@Body() dto: CheckRateLimitDto, @Req() req: Request & { apiKey: ApiKey }) {
        return this.slidingLogService.check(req.apiKey.keyHash, dto.identifier, dto.limit, dto.windowSeconds);
    }

    @Post('check/token-bucket')
    checkTokenBucket(@Body() dto: CheckRateLimitDto, @Req() req: Request & {apiKey:ApiKey}){
        return this.tokenBucketService.check(req.apiKey.keyHash,dto.identifier,dto.limit,dto.windowSeconds);
    }
    @Post('check/sliding-window-counter')
    checkSlidingWindowCounter(@Body() dto: CheckRateLimitDto, @Req() req: Request & {apiKey:ApiKey}){
        return this.slidingWindowCounter.check(req.apiKey.keyHash,dto.identifier,dto.limit,dto.windowSeconds);
    }
}
