import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelPlanDto, EditPlanDto, GetPlanDto ,PlanDto } from './dto';
import { v4 as uuid } from "uuid";
import * as moment from "moment"

@Injectable()
export class PlanService {
    constructor(private prisma: PrismaService) {}
    
    async GetPlans(dto: GetPlanDto ,userid: number) {
        const plan = await this.prisma.plan.findMany({
            where: {
                UserId: userid
            }
        });
        if(!plan) {
            return { plan ,stat: 200 };
        } else {
            return { msg: "user doesn't exist" ,stat: 1 };
        }
    }

    async CreatePlan(dto: PlanDto ,usrid: number) {
        console.log(usrid);
        await this.prisma.plan.create({
            data: {
                UserId: usrid,
                date: new Date(),
                blocked1: dto.blocked1,
                blocked2: dto.blocked2,
                ends: dto.end,
                starts: dto.start,
                planid: uuid(),
            }
        });
        // let tasks = [
        //     {"name": "math", "imp": 15 ,"min": 92 ,"score": null},
        //     {"name": "arabic", "imp": 4 ,"min": 10 ,"score": null},
        //     {"name": "coding", "imp": 20 ,"min": 70 ,"score": null},
        //     {"name": "coding2" ,"imp": 12 ,"min" :54 ,"score": null},
        //     {"name": "coding3" ,"imp": 3 ,"min" :20 ,"score": null},
        //     {"name": "coding4" ,"imp": 9 ,"min" :19 ,"score": null}
        // ];
        let start_time = moment(dto.start ,"hh:mm");
        let end_time = moment(dto.end ,"hh:mm");
        let blocked_time = [
            moment(dto.blocked1[0] ,"hh:mm"),
            moment(dto.blocked1[0] ,"hh:mm")
        ];
        let sorted_list = [];
        let to;
        let total_time = () => {
            let sum = 0;
            for(let it = 0;it < dto.tasks.length;it++) {
                sum += dto.tasks[it]["min"];
            }
            return sum;
        }
        function create_i(inp) {
            let inp_dev = Math.floor(inp % 25);
            let inp_dev2 = Math.floor(inp / 25);
            if(inp_dev > 13 && inp_dev < 20) {
                inp_dev2++;
            }
            return [ inp_dev2 , inp_dev ];
        }
        function sort_tasks() {
            for(let i in dto.tasks) {
                dto.tasks[i]["score"] = (dto.tasks[i]["min"] / 15) + dto.tasks[i]["imp"];
            }
            dto.tasks.sort((a ,b) => b.score - a.score);
        }
        sort_tasks();
        function split_sort(task) {
            let itr = create_i(task.min);
            if(task.min > 25){
                for(let i = 0;i < itr[0] ;i++) {
                    if(i === 0) {
                        to = moment(start_time);
                        to.add((itr[1] + 25) ,"minutes")
                        blocked_time[0].subtract(5 ,"minutes");
                        sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
                        if(moment(to).isBetween(moment(blocked_time[0]) ,moment(blocked_time[1]))) {
                            start_time = moment(blocked_time[1]);
                            start_time.add((itr[1] + 25) ,"minutes");
                        } else {
                            start_time.add((itr[1] + 30) ,"minutes");
                            sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
                        }
                    } else {
                        to = moment(start_time);
                        to.add(25 ,"minutes")
                        blocked_time[0].subtract(5 ,"minutes");
                        sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
                        if(moment(to).isBetween(moment(blocked_time[0]) ,moment(blocked_time[1]))) {
                            start_time = moment(blocked_time[1])
                            start_time.add(30 ,"minutes");
                        } else {
                            start_time.add(25 ,"minutes");
                            sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
                        }
                    } 
                }
            } else {
                to = moment(start_time);
                to.add(task.min ,"minutes")
                blocked_time[0].subtract(5 ,"minutes");
                sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
                if(moment(to).isBetween(moment(blocked_time[0]) ,moment(blocked_time[1]))) {
                    start_time = moment(blocked_time[1])
                    start_time.add(task.min + 5 ,"minutes");
                } else {
                    start_time.add(task.min ,"minutes");
                    sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
                }
            }
        }
        
        if((total_time() + (Math.floor(total_time() / 30)) * 5) > (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes")))) {
        
            dto.tasks.forEach((task) => {
                split_sort(task);
            })
        } else {
            let i = 0;
            while (i < dto.tasks.length) {
                if (dto.tasks[i].min > 30) {
                    i++;
                }
            }
            let diff = (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes"))) - (total_time() + (Math.floor(total_time() / 30)) * 5);
            dto.tasks.forEach((task) => {
                if(task.min > 30){
                    task.min -= Math.floor(diff / i);
                }
                split_sort(task);
            })
        }
        sorted_list.pop();
        return sorted_list;
    }

    async EditPlan(dto: EditPlanDto ,userid: number): Promise<{msg: string}> {
        const plan = await this.prisma.plan.findUnique({
            where :{
                planid: dto.id,
            }
        });
        if(userid === plan.UserId) {
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

    async DelPlan(dto: DelPlanDto ,userid: number): Promise<{msg: string}> {
        const plan = await this.prisma.plan.findUnique({
            where :{
                planid: dto.id,
            }
        });
        if(userid === plan.UserId) {
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