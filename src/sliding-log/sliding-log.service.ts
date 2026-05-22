import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitExceededException } from 'src/rate-limit/rate-limit-exceeded.exception';

@Injectable()
export class SlidingLogService {
    constructor(@InjectRedis() private redis:Redis){}
    async check(apiKey: string, identifier: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean, remaining: number, resetAt: Date }>{
        const now=Date.now();
        const windowStart = now-windowSeconds*1000;
        const redisKey = `rl:sliding-log:${apiKey}:${identifier}`
        await this.redis.zremrangebyscore(redisKey,0,windowStart);
        await this.redis.zadd(redisKey,now,now.toString());
        const count = await this.redis.zcard(redisKey);
        const oldest = await this.redis.zrange(redisKey,0,0,'WITHSCORES');
        const oldestMs= oldest.length ? parseInt(oldest[1]):now;
        if(count>limit){
            throw new RateLimitExceededException(new Date(oldestMs+windowSeconds*1000),0);
        }
        return {
            allowed:true,
            remaining:limit-count,
            resetAt:new Date(oldestMs+windowSeconds*1000)
        }
    }

}
