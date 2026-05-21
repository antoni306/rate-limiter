import { Module } from '@nestjs/common';
import { SlidingLogService } from './sliding-log.service';

@Module({
    providers:[SlidingLogService],
    exports:[SlidingLogService]
})
export class SlidingLogModule {}
