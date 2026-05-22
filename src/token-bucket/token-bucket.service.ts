import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitExceededException } from 'src/rate-limit/rate-limit-exceeded.exception';

@Injectable()
export class TokenBucketService {
    constructor(@InjectRedis() private redis:Redis){}

    async check(apiKey: string, identifier: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean, remaining: number, resetAt: Date }>{
        const redisKey = `rl:token-bucket:${apiKey}:${identifier} `
        const bucket = await this.redis.hgetall(redisKey);
        const now = Date.now();
        const tokens = bucket.tokens ? parseFloat(bucket.tokens) : limit;
        const lastRefill = bucket.lastRefill ? parseInt(bucket.lastRefill):now;
        const elapsed= (now-lastRefill)/1000;

        const refillRate = limit / windowSeconds;

        const newTokens = Math.min(limit,tokens+elapsed*refillRate);

        const allowed = newTokens>=1;
        
        const updatedTokens = allowed ? newTokens -1 :newTokens;
        await this.redis.hset(redisKey, 'tokens', updatedTokens.toString(),'lastRefill', now.toString());
        const timeToNextToken = (1-updatedTokens) /refillRate * 1000
        if(!allowed){
            throw new RateLimitExceededException(new Date(now +timeToNextToken),0)
        }
        return{
            allowed:allowed,
            remaining:updatedTokens,
            resetAt:new Date(now +timeToNextToken),
        }
    }

}
