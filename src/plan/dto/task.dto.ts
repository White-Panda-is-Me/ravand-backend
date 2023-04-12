import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PlanDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsOptional()
    Blocked: string;

    @IsString()
    @IsNotEmpty()
    start: string;

    @IsString()
    @IsNotEmpty()
    end: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    plan: object[];
}

export class DelPlanDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    usrid: string;
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