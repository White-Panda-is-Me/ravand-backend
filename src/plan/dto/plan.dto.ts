import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import * as moment from "moment";

export class PlanDto {
    @IsArray()
    @IsOptional()
    blocked1: string[];
    
    @IsArray()
    @IsOptional()
    blocked2: string[];

    @IsString()
    @IsNotEmpty()
    start: string;

    @IsString()
    @IsNotEmpty()
    end: string;

    @IsNotEmpty()
    @IsArray()
    tasks: {name ,imp ,min ,score}[];
}

export class DelPlanDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class EditPlanDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    usrid: string;

    @IsString()
    @IsOptional()
    starts?: string;

    @IsString()
    @IsOptional()
    ends?: string;
}

export class GetPlanDto {
    @IsString()
    @IsNotEmpty()
    usrid: string;

    @IsOptional()
    @IsNumber()
    starts: number;
    
    @IsOptional()
    @IsNumber()
    ends: number;
}