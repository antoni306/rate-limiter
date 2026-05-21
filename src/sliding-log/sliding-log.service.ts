import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

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
        return {
            allowed:count<=limit,
            remaining:Math.max(0,limit-count),
            resetAt:new Date(oldestMs+windowSeconds*1000)
        }
    }

}
