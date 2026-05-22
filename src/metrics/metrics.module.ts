import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { makeCounterProvider, PrometheusModule,makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
    imports:[PrometheusModule.register()],
    providers:
    [
        MetricsService,
        makeCounterProvider({ name: 'rate_limit_requests_total', help: 'Total rate limit requests', labelNames: ['strategy'] }),
        makeCounterProvider({ name: 'rate_limit_rejections_total', help: 'Total rate limit rejections', labelNames: ['strategy'] }),
        makeHistogramProvider({ name: 'rate_limit_latency_seconds', help: 'Rate limit check latency', labelNames: ['strategy'] }),
    ],
    exports:[MetricsService]
})
export class MetricsModule {}
