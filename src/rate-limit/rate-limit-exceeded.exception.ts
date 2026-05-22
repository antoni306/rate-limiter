import { HttpException, HttpStatus } from "@nestjs/common";

export class RateLimitExceededException extends HttpException{
    constructor(resetAt:Date, remaining: number){
        super({message:'Rate limit exceeded',remaining,resetAt},HttpStatus.TOO_MANY_REQUESTS);
    }
}