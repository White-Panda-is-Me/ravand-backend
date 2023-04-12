import { Controller, Delete, Get, UseGuards, Put, Body } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { LGDltUserDto, EditUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private UsrService: UserService) {}
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    GetMe(@GetUser() user: User) {
        return user;
    }
    
    @Delete("dlt")
    Delete(@Body() dto: LGDltUserDto) {
        return this.UsrService.Delete(dto);
    }

    @Put("log-out")
    LogOut(@Body() dto: LGDltUserDto) {
        return this.UsrService.LogOut(dto);
    }

    @Put("Edit")
    EditUser(@Body() dto: EditUserDto) {
        return this.UsrService.EditUser(dto);
    }
}