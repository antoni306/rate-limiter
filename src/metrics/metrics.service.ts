import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
    constructor(
        @InjectMetric('rate_limit_requests_total') private reguestsCounter: Counter<string>,
        @InjectMetric('rate_limit_rejections_total') private rejectionsCounter: Counter<string>,
        @InjectMetric('rate_limit_latency_seconds') private latencyHistogram: Histogram<string>,
    ){}
    incrementRequests(strategy:string){
        this.reguestsCounter.inc({strategy});
    }
    incrementRejections(strategy: string){
        this.rejectionsCounter.inc({strategy});
    }
    observeLatency(strategy: string, seconds:number){
        this.latencyHistogram.observe({strategy},seconds);
    }
}
