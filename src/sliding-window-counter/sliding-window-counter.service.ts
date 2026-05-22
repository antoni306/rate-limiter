import { InjectRedis } from '@nestjs-modules/ioredis';
import {  Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitExceededException } from 'src/rate-limit/rate-limit-exceeded.exception';

@Injectable()
export class SlidingWindowCounterService {
    constructor(@InjectRedis() private redis:Redis){}

    async check(apiKey:string, identifier:string, limit:number, windowSeconds:number):Promise<{allowed:boolean, remaining: number, resetAt:Date}>{
        const now = Date.now();
        const window = Math.floor(now/1000/windowSeconds);
        const previousCounter = await this.redis.get(`rl:sliding-window-counter:${apiKey}:${identifier}:${window-1}`);
        const currentCounter = await this.redis.get(`rl:sliding-window-counter:${apiKey}:${identifier}:${window}`);
        
        const timeElapsed = (now-(window*1000*windowSeconds))/1000;
        const progress =timeElapsed/windowSeconds
        const weight = 1- progress;
        const parsedPrev = previousCounter ? parseInt(previousCounter):0;
        const parsedCurr = currentCounter ? parseInt(currentCounter):0;
        
        const estimated = parsedPrev*weight+ parsedCurr;

        if(estimated<=limit){
            await this.redis.incr(`rl:sliding-window-counter:${apiKey}:${identifier}:${window}`);
            await this.redis.expire(`rl:sliding-window-counter:${apiKey}:${identifier}:${window}`,windowSeconds*2);
        }else{
            throw new RateLimitExceededException(new Date((window+1)*1000*windowSeconds),0)
        }
        return {allowed:true, remaining: limit-estimated, resetAt:new Date((window+1)*1000*windowSeconds)}
    }
       
}
