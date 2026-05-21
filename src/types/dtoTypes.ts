import { IsNumber, IsString } from "class-validator";

export class CreateApiKeyDto{
    @IsString()
    name:string;
}

export class CheckRateLimitDto{
    @IsString()
    identifier:string;
    @IsNumber()
    limit:number;
    @IsNumber()
    windowSeconds:number;
}