import { Module } from '@nestjs/common';
import { TokenBucketService } from './token-bucket.service';

@Module({
  providers: [TokenBucketService],
  exports:[TokenBucketService]
})
export class TokenBucketModule {}
