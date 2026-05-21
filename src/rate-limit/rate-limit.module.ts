import { Module } from '@nestjs/common';
import { RateLimitController } from './rate-limit.controller';
import { FixedWindowModule } from 'src/fixed-window/fixed-window.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { SlidingLogModule } from 'src/sliding-log/sliding-log.module';

@Module({
    imports:[FixedWindowModule,ApiKeyModule,SlidingLogModule],
    controllers:[RateLimitController],
    exports:[]
})
export class RateLimitModule {}
