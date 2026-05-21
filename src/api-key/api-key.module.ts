import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysService } from 'src/api-key/api-key.service';
import { ApiKey } from 'src/entities/ApiKey.entity';
import { RateLimitRule } from 'src/entities/RateLimitRule.entity';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyController } from './api-key.controller';

@Module({
    imports:[TypeOrmModule.forFeature([ApiKey,RateLimitRule])],
    providers:[ApiKeysService,ApiKeyGuard],
    exports:[ApiKeysService,ApiKeyGuard],
    controllers: [ApiKeyController]
})
export class ApiKeyModule {
}
