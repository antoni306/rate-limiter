import { Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
import { RateLimitRule } from "./RateLimitRule.entity";

@Entity()
export class ApiKey{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    keyHash:string;


    @Column()
    name:string;


    @Column()
    isActive: boolean;

    @Column()
    createdAt:Date;

    @OneToMany(()=>RateLimitRule,(rateLimitRule)=>rateLimitRule.apiKey,)
    rateLimitRules:RateLimitRule[]

}