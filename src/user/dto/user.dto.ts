import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsOptional()
    fn: string;
    
    @IsString()
    @IsOptional()
    ln: string;
}

export class LGDltUserDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}