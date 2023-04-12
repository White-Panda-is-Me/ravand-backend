import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelPlanDto, EditPlanDto, GetPlanDto, PlanDto } from './dto';

@Injectable()
export class PlanService {
    constructor(private prisma: PrismaService) {}
    
    async GetPlans(dto: GetPlanDto) {
        const plan = await this.prisma.plan.findMany({
            where: {
                userUUID: dto.usrid
            }
        });
        if(!plan) {
            return { plan ,stat: 200 };
        } else {
            return { msg: "user doesn't exist" ,stat: 1 };
        }
    }

    // async CreatePlan(dto: PlanDto) {
    //     let tasks: object[] = [];
    //     await this.prisma.plan.create({
    //         data: {
    //             userUUID: dto.uuid,
    //             ends: dto.end,
    //             starts: dto.start,
    //             planid: uuid(),
    //             name: dto.name
    //         }
    //     });
    //     tasks = this.sort_task(dto.plan);
    // }

    async EditPlan(dto: EditPlanDto): Promise<{msg: string}> {
        const plan = await this.prisma.plan.findUnique({
            where :{
                planid: dto.id,
            }
        });
        if(dto.usrid === plan.userUUID) {
            await this.prisma.plan.update({
                where: {
                    planid: plan.planid,
                },
                data: {
                    starts: dto.starts,
                    ends: dto.ends
                }
            });
            return {msg: "Task Edited successfully."};
        } else {
            return {msg: "Task doesn't exists or the user is not compatible!"};
        }
    }

    async DelPlan(dto: DelPlanDto): Promise<{msg: string}> {
        const plan = await this.prisma.plan.findUnique({
            where :{
                planid: dto.id,
            }
        });
        if(dto.usrid === plan.userUUID) {
            await this.prisma.plan.delete({
                where: {
                    planid: plan.planid,
                }
            });
            return {msg: "Task Deleted successfully."};
        } else {
            return {msg: "Task doesn't exists or the user is not compatible!"};
        }
    }
}