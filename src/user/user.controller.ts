import { Controller, Get, UseGuards, Put, Body, Post, HttpCode, Query, Header, Headers, Res } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { EditUserDto , LnkChildDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { AuthUser } from "./decorator";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";

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

    @HttpCode(200)
    @Post("childreq")
    ChildReq(@Body() dto: LnkChildDto ,@AuthUser() usrid: number) {
        return this.UsrService.LinkChild(dto ,usrid);
    }

    @HttpCode(200)
    @Get("accept")
    AcceptReq(@Query("reqid") reqid ,@Query("Authorization") jwt ,@Res() res) {
        const jwtService = new JwtService({ secret: 'super-secret' });
        const payload = jwtService.verify(jwt);
        return this.UsrService.AcceptChid(Number(reqid) ,payload ,res);
    }

    @HttpCode(200)
    @Post("getchilds")
    async GetChilds(@AuthUser() id: number) {
        return this.UsrService.GetChilds(id);
    }
}