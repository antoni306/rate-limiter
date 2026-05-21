import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeysService } from 'src/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService:ApiKeysService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request:any):Promise<boolean>{
    const rawKey = request.headers['x-api-key'];
    const apiKey= await this.apiKeyService.checkApiKey(rawKey);
    if(apiKey == null)
      throw new UnauthorizedException('invalid or expired apiKey');
    request.apiKey=apiKey;
    return true;
  }
}
