import { InjectRedis} from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class FixedWindowService {
    constructor(@InjectRedis() private redis:Redis){}
    async check(apiKey:string, identifier:string, limit:number, windowSeconds:number):Promise<{allowed:boolean, remaining: number, resetAt:Date}>{
        const windowStart = Math.floor(Date.now()/1000/windowSeconds);
        const redisKey = `rl:fixed:${apiKey}:${identifier}:${windowStart}`
        const count = await this.redis.incr(redisKey);
        if(count === 1){
            await this.redis.expire(redisKey,windowSeconds);
        }
        return {allowed:count<=limit, remaining: Math.max(0,limit-count), resetAt:new Date((windowStart+1)*1000*windowSeconds)}
    }
}
