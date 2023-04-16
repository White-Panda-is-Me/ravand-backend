import { ForbiddenException, Injectable, Inject, HttpStatus, HttpException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Authdto , Authindto, FSDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt/dist";
import { secret } from "./auth.const";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment"; 
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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

    private async sendAuthMail (pass: string ,email: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "hlangari1353@gmail.com",
                pass: "cxvarvezccwedmxe"
            },
        });

        const mail = {
            from: "hlangari1353@gmail.com",
            to: email,
            subject: "Confirm It's You",
            text: `Hello \nWe've noticed you had signed up in Ravand app.Here's Your Authentication code: ${pass}\nDon't share with with anyone.`
        };

        transporter.sendMail(mail ,(error) => {
            if (error) {
                console.log(error);
            }
        });
    }
    
    async signup (dto: Authdto) {
        await this.prisma.vers.deleteMany({
            where: {
                AND:[
                    { OR:[
                        {expire: {
                            lt: new Date(),
                        }},
                        {email: dto.email},
                    ] },
                    { signed: false }
                ]
            }
        });
        const pass = this.genpass();
        const token = this.GenUUID();
        this.sendAuthMail(pass ,dto.email);
        try {
            await this.prisma.vers.create({
                data: {
                    code: pass,
                    email: dto.email,
                    expire: moment().add(5, 'minutes').toDate(),
                    signed: false,
                    token
                }
            });
            return { token: token };
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                if(err.code == 'P2002') {
                    throw new HttpException("User exists!" ,409);
                }
            }
            console.log(err);
        }
    }
    
    async FinishSignup(dto: FSDto) {
        const vered_user = await this.prisma.vers.findUnique({
            where: {
                token: dto.token
            }
        });
        if(!vered_user) {
            return new HttpException("user doesn't exist" ,403);
        } else {
            const hash = await argon.hash(dto.password);
            if(vered_user.code === dto.ipass && moment().diff(moment(vered_user.expire) ,"milliseconds") < 0){
                const user = await this.prisma.user.create({
                    data: {
                        email: vered_user.email,
                        fName: dto.fn,
                        lName: dto.ln,
                        hash,
                        UpdatedAt: new Date(),
                    }
                });
                await this.prisma.vers.update({
                    where: {
                        token: vered_user.token
                    },
                    data: {
                        signed: true,
                    }
                });
                return this.signToken(user.id);
            } else {
                return new HttpException("password doesn't match or is expired!" ,401);
            }
        }
    }

    async signin (dto :Authindto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });
        const ver = await this.prisma.vers.findUnique({
            where: {
                email: dto.email
            },
        });
        if(!user)
            return { msg: "user doesn't exist", stat: 1}
        const pwMatches = await argon.verify(user.hash ,dto.password);
        if(!pwMatches){
            return new HttpException("password doesn't match" ,403);
        }
        if(!ver.signed) {
            await this.prisma.vers.update({
                where: {
                    id: user.id,
                },
                data: {
                    signed: true,
                }
            });
        }
        return this.signToken(user.id);
    }

    async signToken(userId: number): Promise<{jwt: string ;stat: number;}>{
        const payload = {
            sub: userId,
        }
        const sec = secret.sec;
        const token = await this.jwt.signAsync(payload ,{
            expiresIn: '30d',
            secret: sec,
        });
        return { jwt: token, stat: 200 };
    }
}