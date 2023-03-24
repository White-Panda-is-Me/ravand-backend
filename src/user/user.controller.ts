import { Controller, Get, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";

@Controller('users')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    GetMe(@GetUser() user: User) {
        return user;
    }
}