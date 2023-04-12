import { Injectable } from "@nestjs/common";
import { EditUserDto, LGDltUserDto } from "./dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async Delete(dto: LGDltUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                token: dto.uuid
            }
        });
        if(!user) {
            return { msg: "User Doesn't exist with this Id!", stat: 1 };
        }
        const pwMatches = await argon.verify(user.hash ,dto.password);
        if(!pwMatches) {
            return { msg: "password is incorrect!", stat: 403 };
        }
        await this.prisma.plan.deleteMany({
            where: {
                userUUID: user.token,
            },
        });
        await this.prisma.user.delete({
            where: {
                id: user.id,
            },
        });
        return { msg: "Successfully deleted account and tasks!", stat: 200 };
    }
        
    async LogOut(dto: LGDltUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                token: dto.uuid
            }
        });
        if(!user) {
            return { msg: "User Doesn't exist with this Id!" ,stat: 1 };
        }
        const pwMatches = await argon.verify(user.hash ,dto.password);
        if(!pwMatches) {
            return { msg: "password is incorrect!", stat: 403 };
        }
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                Activated: false,
            },
        });
        return { msg: "Successfully Loged Out!", stat: 200 };
    }

    async EditUser(dto: EditUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                token: dto.uuid
            }
        });
        if(!user) {
            return { msg: "user doesn't exist with this uuid"! ,stat: 1 };
        } else {
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    fName: dto.fn,
                    lName: dto.ln,
                }
            });
        }
        return { msg: "Successsfully edited user" ,stat: 200 };
    }
}