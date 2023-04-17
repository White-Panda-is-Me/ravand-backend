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
        let tasks = dto.tasks;
        console.log(usrid);
        await this.prisma.plan.create({
            data: {
                UserId: usrid,
                date: new Date(),
                ends: dto.end,
                starts: dto.start,
                planid: uuid(),
            }
        });
let start_time = moment(dto.start ,"hh:mm");
let end_time = moment(dto.end ,"hh:mm");
let blocked_time = dto.blocked;
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
let blocked_i = 0;
function split_sort(task) {
    let itr = create_i(task.min);
    if(task.min > 25){
        for(let i = 0;i < itr[0] ;i++) {
            if(i === 0) {
                to = moment(start_time);
                to.add((itr[1] + 25) ,"minutes")
                sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
                if(moment(to).isBetween(moment(blocked_time[blocked_i].start) ,moment(blocked_time[blocked_i].end))) {
                    blocked_time[blocked_i].start.add(10 ,"minutes");
                    sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("hh:mm") ,"to": blocked_time[blocked_i].end.format("hh:mm")})
                    blocked_time[blocked_i].start.subtract(10 ,"minutes");
                    start_time = moment(blocked_time[blocked_i].end);
                    to = start_time;
                    start_time.add((itr[1] + 25) ,"minutes");
                    if(blocked_i < blocked_time.length - 1)
                        blocked_i++;
                } else {
                    start_time.add((itr[1] + 30) ,"minutes");
                    sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
                }
            } else {
                to = moment(start_time);
                to.add(25 ,"minutes")
                sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
                if(moment(to).isBetween(moment(blocked_time[blocked_i].start) ,moment(blocked_time[blocked_i].end))) {
                    blocked_time[blocked_i].start.add(10 ,"minutes");
                    sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("hh:mm") ,"to": blocked_time[blocked_i].end.format("hh:mm")})
                    blocked_time[blocked_i].start.subtract(10 ,"minutes");
                    start_time = moment(blocked_time[blocked_i].end);
                    to = start_time;
                    start_time.add(30 ,"minutes");
                    if(blocked_i < blocked_time.length - 1)
                        blocked_i++;
                } else {
                    start_time.add(30 ,"minutes");
                    sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
                }
            } 
        }
    } else {
        to = moment(start_time);
        to.add(task.min ,"minutes")
        sorted_list.push({"name": task.name ,"from": start_time.format("hh:mm") ,"to": to.format("hh:mm")});
        if(moment(to).isBetween(moment(blocked_time[blocked_i].start) ,moment(blocked_time[blocked_i].end))) {
            blocked_time[blocked_i].start.add(10 ,"minutes");
            start_time = moment(blocked_time[blocked_i].end)
            blocked_time[blocked_i].start.subtract(10 ,"minutes");
            start_time.add(task.min + 5 ,"minutes");
            if(blocked_i < blocked_time.length - 1)
                blocked_i++;
        } else {
            start_time.add(task.min ,"minutes");
            sorted_list.push({"name": "rest" ,"from": to.format("hh:mm") ,"to": start_time.format("hh:mm")});
        }
    }
}
// let sum: number;
// fo
//if((total_time() + (Math.floor(total_time() / 30)) * 5) > (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes")))) {

    tasks.forEach((task) => {
        split_sort(task);
    })
// } else {
    //let diff = (Math.abs(moment(start_time).diff(end_time ,"minutes"))) - (Math.abs(moment(blocked_time[0]).diff(blocked_time[1] ,"minutes"))) - (total_time() + (Math.floor(total_time() / 30)) * 5);
    // tasks.forEach((task) => {
    //     // task.min -= (Math.floor(diff / tasks.length) + Math.floor(task.min / 25) + 1);
    //     split_sort(task);
    // })
// }

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