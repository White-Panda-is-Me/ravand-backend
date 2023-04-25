import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelPlanDto, EditPlanDto ,PlanDto } from './dto';
import * as moment from "moment"

@Injectable()
export class PlanService {
    constructor(private prisma: PrismaService) {}
    
    async GetPlans(userid: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userid,
            }
        });
        if(!user) {
            throw new HttpException("user doesn't exist" ,404)
        } else {
            const plan = await this.prisma.plan.findMany({
                where: {
                    UserId: userid
                }
            });
            if(!plan) {
                throw new HttpException("plan doesn't exist" ,450);
            } else {
                return plan;
            }
        }
    }

    async CreatePlan(dto: PlanDto ,usrid: number) {
        let tasks = dto.tasks;
        let start_time = moment(dto.start ,"H:m");
        let end_time = moment(dto.end ,"H:m");
        let blocked_time;
        let isblocked: boolean;
        if(dto.blocked.length === 0) {
            blocked_time = null;
            isblocked = false;
        } else {
            blocked_time = dto.blocked;
            isblocked = true;
        }
        if(isblocked){
            for(let i = 0;i < blocked_time.length;i++) {
                blocked_time[i].start = moment(blocked_time[i].start ,"H:m");
                blocked_time[i].end = moment(blocked_time[i].end ,"H:m");
            }
            blocked_time.sort((a ,b) => a.start.toDate() - b.start.toDate())
            for(let i = 0;i < blocked_time.length;i++) {
                for(let j = 0;j < blocked_time.length;j++) {
                    if(i === j){
                        continue;
                    } else if(blocked_time[i].start.isBetween(blocked_time[j].start ,blocked_time[j].end)){
                        throw new HttpException("Blocked times can't be in each other!" ,410);
                    }
                }
            }
        }
        if(isblocked) {
            for(let i = 0;i < blocked_time.length;i++) {
                if(blocked_time[i].start.isBefore(start_time)) {
                    throw new HttpException("blocked mustn't be before or after start and end time!" ,412);
                } else if(blocked_time[i].end.isAfter(end_time)) {
                    throw new HttpException("blocked mustn't be before or after start and end time!" ,412);
                }
            }
        }
        let sorted_list = [];
        let to = start_time;
        let blocked_i = 0;
        let total_time = () => {
            let sum = 0;
            for(let it = 0;it < tasks.length;it++) {
                sum += tasks[it]["min"];
            }
            return sum;
        }
        let allblocked = () => 0;
        if(isblocked) {
            let allblocked = () => {
                let sum = 0;
                for(let i = 0;i < blocked_time.length;i++) {
                    sum += Math.abs(blocked_time[blocked_i].start.diff(blocked_time[blocked_i].end ,"minutes"));
                }
                return sum;
            }
        }
        let first_diff = total_time() - ((Math.abs(start_time.diff(end_time ,"minutes"))) - allblocked());
        function create_i(inp) {
            let inp_dev = Math.floor(inp % 25);
            let inp_dev2 = Math.floor(inp / 25);
            inp_dev2++;
            return [ inp_dev2 , inp_dev ];
        }
        
        function sort_tasks() {
            for(let i in tasks) {
                tasks[i]["score"] = (tasks[i]["min"] / 15) + tasks[i]["imp"];
            }
            tasks.sort((a ,b) => b.score - a.score);
        }
        
        sort_tasks();
        if(isblocked) {
            blocked_time.map((blocked) => {
                blocked.start.subtract(5 ,"minutes");
            })
        }
        function split_sort(task) {
            let itr = create_i(task.min);
            if(task.min > 25){
                for(let i = 0;i < itr[0] ;i++) {
                    if(i === 0) {
                        if(itr[1] > 9){
                            end_time.subtract(itr[1]);
                            if(to.isSameOrBefore(end_time)){
                                end_time.add(itr[1]);
                                to = moment(start_time ,"H:m");
                                to.add((itr[1]) ,"minutes");
                                if(isblocked) {
                                    if(to.isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
                                        blocked_time[blocked_i].start.add(5 ,"minutes");
                                        sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("H:m") ,"to": blocked_time[blocked_i].end.format("H:m")})
                                        blocked_time[blocked_i].start.subtract(5 ,"minutes");
                                        start_time = moment(blocked_time[blocked_i].end);
                                        to = start_time;
                                        if(blocked_i < blocked_time.length - 1)
                                        blocked_i++;
                                    } else {
                                        sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                                        start_time.add((itr[1] + 5) ,"minutes");
                                        sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                                    }
                                } else {
                                    sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                                    start_time.add((itr[1] + 5) ,"minutes");
                                    sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                                }
                            }
                        }
                    } else {
                        to.subtract(25 ,"minutes");
                        if(to.isSameOrBefore(end_time)){
                            to.add(25 ,"minutes");
                            to = moment(start_time ,"H:m");
                            to.add(25 ,"minutes");
                            if(isblocked) {
                                if(moment(to).isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
                                    blocked_time[blocked_i].start.add(5 ,"minutes");
                                    sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("H:m") ,"to": blocked_time[blocked_i].end.format("H:m")})
                                    blocked_time[blocked_i].start.subtract(5 ,"minutes");
                                    start_time = moment(blocked_time[blocked_i].end);
                                    to = start_time;
                                    if(blocked_i < blocked_time.length - 1)
                                    blocked_i++;
                                } else {
                                    sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                                    start_time.add(30 ,"minutes");
                                    sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                                }
                            } else {
                                sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                                start_time.add(30 ,"minutes");
                                sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                            }
                        }
                    } 
                }
            } else {
                end_time.subtract(task.min);
                if(to.isSameOrBefore(end_time)){
                    end_time.add(task.min);
                    to = moment(start_time ,"H:m");
                    to.add(task.min ,"minutes")
                    if(isblocked) {
                        if(moment(to).isBetween(blocked_time[blocked_i].start ,blocked_time[blocked_i].end)) {
                            blocked_time[blocked_i].start.add(5 ,"minutes");
                            sorted_list.push({"name": blocked_time[blocked_i].name ,"from": blocked_time[blocked_i].start.format("H:m") ,"to": blocked_time[blocked_i].end.format("H:m")})
                            blocked_time[blocked_i].start.subtract(5 ,"minutes");
                            start_time = moment(blocked_time[blocked_i].end);
                            to = start_time;
                            if(blocked_i < blocked_time.length - 1)
                            blocked_i++;
                        } else {
                            sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                            start_time.add(task.min + 5 ,"minutes");
                            sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                        }
                    } else {
                        sorted_list.push({"name": task.name ,"from": start_time.format("H:m") ,"to": to.format("H:m")});
                        start_time.add(task.min + 5 ,"minutes");
                        sorted_list.push({"name": "استراحت" ,"from": to.format("H:m") ,"to": start_time.format("H:m")});
                    }
                }
            }
        }
        
        if(first_diff === 0) {
            tasks.forEach((task) => {
                split_sort(task);
            });
        } else if(first_diff < 0) {
            tasks.forEach((task) => {
                task.min += Math.floor((Math.abs(first_diff) - (Math.abs(first_diff/30)*5 - 1)) / tasks.length);
                split_sort(task);
            })
        } else if(first_diff > 0) {
            tasks.forEach((task) => {
                task.min -= Math.floor((Math.abs(first_diff) - (Math.abs(first_diff/30)*5 - 1)) / tasks.length);
                split_sort(task);
            })
        }
        
        sorted_list.pop();
        sorted_list.pop();
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