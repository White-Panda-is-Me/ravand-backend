import { HttpException, Injectable, Res } from "@nestjs/common";
import { EditUserDto , LnkChildDto , AcceptChildDto } from "./dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import { secret } from "src/auth/auth.const";
import { join } from "path";

@Injectable()
export class UserService{
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

    async LinkChild (dto: LnkChildDto ,usrid: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: usrid
            },
        });
        const child = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });
        if(!user || !child)
            throw new HttpException("user doesn't exist!" ,404);
        if(user.role == Role.Parent && child.role == Role.Child) {
            let req = await this.prisma.childreq.findFirst({
                where: {
                    ChildId: child.id,
                    ParentId: user.id,
                }
            });
            if(req)
                throw new HttpException("You have already requested to your child!" ,407);
            req = await this.prisma.childreq.create({
                data: {
                    ChildId: child.id,
                    ParentId: user.id,
                }
            });

            // create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "hlangari1353@gmail.com",
                    pass: "cxvarvezccwedmxe"
                },
            });

            const jwtService = new JwtService();
            const token = await jwtService.signAsync({ch_id: child.id ,p_id: user.id} ,{
                expiresIn: "10m",
                secret: secret.sec
            });

            // define the email message
            const mailOptions = {
            from: 'hlangari1353@gmail.com',
            to: child.email,
            subject: 'Test Email with Button',
            html: `<body style="text-align: center;"><p>Hello ${child.fName},</p><p>Your parent, ${user.fName} ${user.lName} has requested you. To accept Click the button Below:</p><form method="get" action="http://192.168.1.119:5000/users/accept">
                                                                                                                            <input type="hidden" name="reqid" value="${req.id}">
                                                                                                                            <input type="hidden" name="Authorization" value="${token}">
                                                                                                                            <button style="background-color: rgb(44, 51, 64); border-radius: 4px; color: aliceblue; border-style: none; width: 70px; height: 40px; font-size: medium; font-family: sans-serif;" type="submit">Accept!</button>
                                                                                                                        </form>
                                                                                                                        </body>`
            };

            // send the email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return {reqId: req.id};
        }
    }

    async AcceptChid(reqid: number ,payload: any ,res) {
        const req = await this.prisma.childreq.findUnique({
            where: {
                id: reqid,
            },
        });
        if(!req){
            res.sendFile("/Users/admin/projects/js/app/Ravand/src/html/fail.html");
            throw new HttpException("req doesn't exist!" ,7);
        }
        if(req.ChildId == payload.ch_id && req.ParentId == payload.p_id){
            if(!req.Accepted) {
                try {
                    await this.prisma.childreq.update({
                        where: {
                            id: req.id,
                        },
                        data: {
                            Accepted: true,
                        },
                    });
                    await this.prisma.user.update({
                        where: {
                            id: payload.ch_id
                        } ,
                        data: {
                            ParentId: payload.p_id
                        }
                    })
                } catch (err) {
                    res.sendFile("/Users/admin/projects/js/app/Ravand/src/html/fail.html");
                }
                res.sendFile("/Users/admin/projects/js/app/Ravand/src/html/done.html");
            } else {
                res.sendFile("/Users/admin/projects/js/app/Ravand/src/html/done.html");
                throw new HttpException("relation exists!" ,404);
            }
        } else {
            res.sendFile("/Users/admin/projects/js/app/Ravand/src/html/done.html");
            throw new HttpException("Forrbidden!" ,403);
        }
    }
    async GetChilds(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });
        if(!user)
            throw new HttpException("User doesn't exist!" ,404);
        const childs = await this.prisma.user.findMany({
            where: {
                ParentId: id
            }
        });
        if(!childs)
            return null;
        childs.map((child) => {
            delete child.hash;
            delete child.role;
            delete child.ParentId;
        });
        return childs;
    }
}