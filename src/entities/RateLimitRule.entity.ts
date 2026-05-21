import { RateLimitStrategy } from "src/types/EntityTypes";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ApiKey } from "./ApiKey.entity";


@Entity()
export class RateLimitRule{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    identifierPattern:string;

    @Column()
    limit:number;

    @Column()
    windowSeconds:number;

    @Column({type:'enum',enum:RateLimitStrategy})
    strategy: RateLimitStrategy;

    @ManyToOne(()=>ApiKey,(user)=>user.rateLimitRules,{onDelete:'CASCADE'})
    apiKey:ApiKey

}