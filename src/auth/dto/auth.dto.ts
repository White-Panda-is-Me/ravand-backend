import { IsString , IsNotEmpty, IsEmail, IsNumber } from "class-validator";

export class Authdto{
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
}

export class Authindto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class FSDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    ipass: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fn: string;

    @IsString()
    @IsNotEmpty()
    ln: string;
}