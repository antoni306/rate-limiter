import { Module } from '@nestjs/common';
import { FixedWindowService } from './fixed-window.service';

@Module({
    providers:[FixedWindowService],
    exports:[FixedWindowService],
})
export class FixedWindowModule {}
