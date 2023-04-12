import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { secret } from "../auth.const";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy ,'jwt') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret.sec,
        });
    }

    async validate(payload: {sub: number}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        delete user.time;
        delete user.signin_password;
        delete user.hash;
        return user;
    }
}