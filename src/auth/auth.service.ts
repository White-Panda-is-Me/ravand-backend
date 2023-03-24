import { ForbiddenException, Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Authdto , Authindto, FSDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt/dist";
import { secret } from "./auth.const";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService ,private jwt: JwtService) {}

    private GenUUID() {
        const uuid = uuidv4();
        return uuid;
    }

    private genpass ():string {
        let pass: string = "";
        const chars = "0123456789";
        for(let i = 0;i < 6;i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    private async sendAuthMail (name: string ,pass: string ,email: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "hlangari1353@gmail.com",
                pass: "llicxgcjvcoufamn"
            }
        });

        const mail = {
            from: "hlangari1353@gmail.com",
            to: email,
            subject: "Confirm It's You",
            text: `Hello ${name} \nWe've noticed you had signed up in Ravand app.Here's Your Authentication code: ${pass}\nDon't share with with anyone.`
        };

        transporter.sendMail(mail ,(error) => {
            if (error) {
                console.log(error);
            }
        });
    }

    async signup (dto: Authdto): Promise<{ uuid: string; }> {
        await this.prisma.user.deleteMany({
            where: {
                Activated: false,
                AND: {
                    time: {
                        lt: (Math.floor(Date.now() / 60000) - 10)
                    }
                }
            }
        });
        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                    fName: dto.fn,
                    lName: dto.ln,
                    token: this.GenUUID(),
                    signin_password: this.genpass(),
                    time: Math.floor(Date.now() / 60000)
                },
            });
            this.sendAuthMail(dto.fn ,user.signin_password ,dto.email);
            return { uuid: user.token };
        }catch (err){
            if(err instanceof PrismaClientKnownRequestError){
                if (err.code === 'P2002') {
                    throw new ForbiddenException('Creadential taken!');
                }
            }
            throw err;
        }
    }

    async FinishSignup(dto: FSDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                token: dto.token,
            }
        });
        if (user !== null && Math.floor(Date.now() / 60000) > (user.time + 10)) {
            await this.prisma.user.delete({
                where: {
                    id: user.id,
                }
            });
            return "uuid expiared!";
        } else {
            if(user !== null && dto.ipass === user.signin_password){
                await this.prisma.user.update({
                    where: {
                        email: user.email,
                    },
                    data: {
                        Activated: true,
                        signin_password: "",
                        token: "",
                        time: 0,
                    }
                });
                return this.signToken(user.id);
            }
        }
    }

    async signin (dto :Authindto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });
        if(!user)
            throw new ForbiddenException('Credentail incorrect!');
        const pwMatches = await argon.verify(user.hash ,dto.password);
        if(!pwMatches){
            throw new ForbiddenException('Creadentail incorrect');
        }
        return this.signToken(user.id);
    }

    async signToken(userId: number): Promise<{msg: string ;jwt: string;}>{
        const payload = {
            sub: userId,
        }
        const sec = secret.sec;
        const token = await this.jwt.signAsync(payload ,{
            expiresIn: '10m',
            secret: sec,
        });
        return { msg: "Token Generated" , jwt: token }
    }
}