import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelTaskDto, EditTaskDto, TasksDto } from './dto';
import { } from "@nestjs/graphql";

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async Add(dto: TasksDto) {
        await this.prisma.task.create({
            data: {
                taskAlias: dto.Alias,
                taskImp: dto.Imp,
                userId: dto.UsrId,
                taskDes: dto.Des,
            },
        });
    }
    async Delete(dto: DelTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: {
                taskid: dto.id,
            }
        });
        if (task.userId === dto.UserId) {
            await this.prisma.task.delete({
                where: {
                    taskid: dto.id,
                }
            });
        }
    }
    async Edit(usrId: number ,dto: EditTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: {
                taskid: dto.id,
            }
        });
        if(usrId === task.userId) {
            await this.prisma.task.update({
                where: {
                    taskid: dto.id,
                },
                data: {
                    taskAlias: dto.Alias,
                    taskDes: dto.Des,
                    taskImp: dto.Imp,
                }
            });
        }
    }
}
