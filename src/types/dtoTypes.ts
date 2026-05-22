import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateApiKeyDto{
    @ApiProperty()
    @IsString()
    name:string;
}

export class CheckRateLimitDto{
    @ApiProperty()
    @IsString()
    identifier:string;
    
    @ApiProperty()
    @IsNumber()
    limit:number;

    @ApiProperty()
    @IsNumber()
    windowSeconds:number;
}