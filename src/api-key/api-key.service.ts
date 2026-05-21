import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from "crypto"
import { ApiKey } from 'src/entities/ApiKey.entity';
import { CreateApiKeyDto } from 'src/types/dtoTypes';
import { Repository } from 'typeorm';
@Injectable()
export class ApiKeysService {
    constructor(@InjectRepository(ApiKey) private repository:Repository<ApiKey>){}
    public async create(createApiKeyDto:CreateApiKeyDto):Promise<{rawKey:string}>{
        const rawKey= crypto.randomBytes(32).toString('hex');
        const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
        const apiKey:Partial<ApiKey> = 
        await this.repository.save({
            ...createApiKeyDto,
            createdAt: new Date(),
            isActive:true,
            keyHash:hash
        });
        return {rawKey};
    }
    public async checkApiKey(rawKey:string):Promise<ApiKey|null>{
        const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
        return this.repository.findOne({where:{keyHash:hash, isActive:true}});
    }
}
