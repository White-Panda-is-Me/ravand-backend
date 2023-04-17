import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PlanDto {
    @IsArray()
    @IsOptional()
    blocked?: any[];

    @IsString()
    @IsNotEmpty()
    start: string;

    @IsString()
    @IsNotEmpty()
    end: string;

    @IsNotEmpty()
    @IsArray()
    tasks: any[];
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