import { IsArray, IsNotEmpty } from "class-validator";

export class TaskDto {
    @IsArray()
    @IsNotEmpty()
    tasks: object[];
}