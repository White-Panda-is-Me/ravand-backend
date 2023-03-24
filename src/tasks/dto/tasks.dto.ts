import { IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class TasksDto {
    @IsNumber()
    @IsNotEmpty()
    Imp: number;
    
    @IsNumber()
    @IsNotEmpty()
    UsrId: number;
    
    @IsString()
    @IsNotEmpty()
    Alias: string;

    @IsOptional()
    Des?: string;
}

export class EditTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsString()
    Des?: string;

    @IsOptional()
    @IsNumber()
    Imp?: number;

    @IsOptional()
    @IsString()
    Alias?: string;
}

export class DelTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    UserId: number;
}