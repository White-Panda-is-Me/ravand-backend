import { HttpException, Injectable } from "@nestjs/common";
import { EditUserDto } from "./dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async EditUser(dto: EditUserDto ,userid: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userid
            }
        });
        if(!user) {
            throw new HttpException("user doesn't exist!" ,404);
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
    }
}