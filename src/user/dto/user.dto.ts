import { IsOptional, IsString } from "class-validator";

export class EditUserDto {
    @IsString()
    @IsOptional()
    fn: string;
    
    @IsString()
    @IsOptional()
    ln: string;
}