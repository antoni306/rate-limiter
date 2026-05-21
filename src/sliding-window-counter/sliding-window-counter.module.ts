import { Module } from '@nestjs/common';
import { SlidingWindowCounterService } from './sliding-window-counter.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports:[RedisModule],
  providers: [SlidingWindowCounterService],
  exports:[SlidingWindowCounterService]
})
export class SlidingWindowCounterModule {}
