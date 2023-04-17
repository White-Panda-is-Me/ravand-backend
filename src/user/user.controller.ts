import { Controller, Get, UseGuards, Put, Body, Request, HttpCode } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { EditUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { AuthUser } from "./decorator";

@Controller('users')
export class UserController {
    constructor(private UsrService: UserService) {}
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    @Get('me')
    GetMe(@GetUser() user: User) {
        return user;
    }

    @HttpCode(200)
    @Put("Edit")
    EditUser(@Body() dto: EditUserDto ,@AuthUser() userid: number) {
        return this.UsrService.EditUser(dto ,userid);
    }
}