import { IsString , IsNotEmpty, IsEmail, IsNumber } from "class-validator";

export class Authdto{
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
    
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
    token: string;

    @IsString()
    ipass: string;
}