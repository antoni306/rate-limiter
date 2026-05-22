import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable,tap, throwError } from 'rxjs';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private metricsService:MetricsService ){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request= context.switchToHttp().getRequest();
    const limit = request.body.limit;
    const strategy = (request.url as string).split("/").at(-1) as string;
    const start=Date.now();
    console.log(strategy);
    return next.handle().pipe(
      tap(data=>{
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit',limit);
        response.setHeader('X-RateLimit-Remaining',data.remaining);
        response.setHeader('X-RateLimit-Reset',Math.floor(new Date(data.resetAt).getTime()/1000));
        this.metricsService.incrementRequests(strategy);
        this.metricsService.observeLatency(strategy,(Date.now()-start)/1000);
      }),
      catchError(err=>{
        this.metricsService.incrementRejections(strategy);
        this.metricsService.observeLatency(strategy,(Date.now()-start)/1000);
        return throwError(()=>err)
      })
    );
  }
}
