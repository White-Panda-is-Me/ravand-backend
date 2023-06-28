import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    fn: string;
    
    @IsString()
    @IsOptional()
    ln: string;
}

export class LnkChildDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class AcceptChildDto {
    @IsNumber()
    @IsNotEmpty()
    reqid: number;
}