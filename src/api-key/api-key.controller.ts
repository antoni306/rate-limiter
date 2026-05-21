import { Body, Controller, Post } from '@nestjs/common';
import { CreateApiKeyDto } from 'src/types/dtoTypes';
import { ApiKeysService } from './api-key.service';
@Controller('api-key')
export class ApiKeyController {
    constructor(private apiKeysService:ApiKeysService){}
    @Post()
    createApiKey(@Body() createApiKeyDto:CreateApiKeyDto):Promise<{rawKey:string}>|any{
        try{
            console.log(`raw body ${JSON.stringify(createApiKeyDto)}`);
            return this.apiKeysService.create(createApiKeyDto);
        } catch(err){
            return err;
        }
    }
}
