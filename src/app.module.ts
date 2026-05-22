import { Module } from '@nestjs/common';
import {ConfigModule,ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RedisModule} from "@nestjs-modules/ioredis";
import { ApiKeyModule } from './api-key/api-key.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { TokenBucketModule } from './token-bucket/token-bucket.module';
import { SlidingWindowCounterModule } from './sliding-window-counter/sliding-window-counter.module';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        type:"postgres",
        host: configService.get("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get("DB_USER"),
        password:configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        autoLoadEntities:true,
        synchronize:true //dev
      })
    }),
    ApiKeyModule,
    RedisModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        type:"single",
        url:`redis://${configService.get("REDIS_HOST")}:${configService.get('REDIS_PORT')}`,
      }),
    },),
    RateLimitModule,
    TokenBucketModule,
    SlidingWindowCounterModule,
  ],
  controllers: [],
})
export class AppModule {}
