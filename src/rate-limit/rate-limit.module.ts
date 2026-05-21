import { Module } from '@nestjs/common';
import { RateLimitController } from './rate-limit.controller';
import { FixedWindowModule } from 'src/fixed-window/fixed-window.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
    imports:[FixedWindowModule,ApiKeyModule],
    controllers:[RateLimitController],
    exports:[]
})
export class RateLimitModule {}
