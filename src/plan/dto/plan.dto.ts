import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PlanDto {
    @IsString()
    @IsNotEmpty()
    start: string;

    @IsString()
    @IsNotEmpty()
    end: string;

    @IsNotEmpty()
    @IsArray()
    tasks: any[];
    
    @IsNotEmpty()
    @IsArray()
    blocked: any[];

    @IsBoolean()
    @IsNotEmpty()
    loop: boolean;
}

export class DelPlanDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
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