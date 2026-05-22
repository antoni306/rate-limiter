import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RateLimitExceededException } from './rate-limit-exceeded.exception';

@Catch(RateLimitExceededException)
export class RateLimitFilter implements ExceptionFilter {
  catch(exception: RateLimitExceededException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const body = exception.getResponse() as any;

    response.status(429).header('Retry-After', Math.floor(new Date(body.resetAt).getTime()/1000)).json(body);
  }
}
