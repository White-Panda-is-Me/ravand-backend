import { Controller, Get, UseGuards, Put, Body, Request } from "@nestjs/common";
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
    @Get('me')
    GetMe(@GetUser() user: User) {
        return user;
    }

    @Put("Edit")
    EditUser(@Body() dto: EditUserDto ,@Request() req) {
        return this.UsrService.EditUser(dto ,req);
    }
}