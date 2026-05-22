import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable,tap } from 'rxjs';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request= context.switchToHttp().getRequest();
    const limit = request.body.limit;
    return next.handle().pipe(
      tap(data=>{
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit',limit);
        response.setHeader('X-RateLimit-Remaining',data.remaining);
        response.setHeader('X-RateLimit-Reset',Math.floor(new Date(data.resetAt).getTime()/1000));
      })
    );
  }
}
