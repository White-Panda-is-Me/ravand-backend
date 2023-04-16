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

    async CreatePlan(dto: PlanDto) {
        await this.prisma.plan.create({
            data: {
                ends: dto.end,
                starts: dto.start,
                planid: uuid(),
                name: dto.name
            }
        });
        let tasks = [
            {"name": "math", "imp": 15 ,"min": 92 ,"score": null},
            {"name": "arabic", "imp": 4 ,"min": 10 ,"score": null},
            {"name": "coding", "imp": 20 ,"min": 70 ,"score": null},
            {"name": "coding2" ,"imp": 12 ,"min" :54 ,"score": null},
            {"name": "coding3" ,"imp": 3 ,"min" :20 ,"score": null},
            {"name": "coding4" ,"imp": 9 ,"min" :19 ,"score": null}
        ];
        let start_time = moment("15:00" ,"hh:mm");
        let end_time = moment("23:30" ,"hh:mm");
        let blocked_time = [
            moment("16:15" ,"hh:mm"),
            moment("17:15" ,"hh:mm")
        ];
        let sorted_list = [];
        let to;
        
        let total_time = () => {
            let sum = 0;
            for(let it = 0;it < tasks.length;it++) {
                sum += tasks[it]["min"];
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
            for(let i in tasks) {
                tasks[i]["score"] = (tasks[i]["min"] / 15) + tasks[i]["imp"];
            }
            tasks.sort((a ,b) => b.score - a.score);
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
        
            tasks.forEach((task) => {
                split_sort(task);
            })
        } else {
            let diff = (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes"))) - (total_time() + (Math.floor(total_time() / 30)) * 5);
            tasks.forEach((task) => {
                // task.min -= (Math.floor(diff / tasks.length) + Math.floor(task.min / 25) + 1);
                split_sort(task);
            })
        }
        
        sorted_list.pop();
        
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