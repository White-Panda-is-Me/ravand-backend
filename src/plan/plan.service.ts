import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelPlanDto, EditPlanDto ,PlanDto } from './dto';
import * as moment from "moment";
import { v4 as uuid } from "uuid";

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
        console.log(dto.start);
        let tasks = dto.tasks;
        let start = moment(dto.start ,"H:m");
        let end = moment(dto.end ,"H:m");
        let blocked = dto.blocked;
        dto.blocked.map((bl ,i) => {
            blocked[i].start = moment(bl.start ,"HH:mm");
            blocked[i].end = moment(bl.end ,"HH:mm");
        })
        // let isblocked: boolean;
        // if(dto.blocked.length === 0) {
        //     blocked_time = null;
        //     isblocked = false;
        // } else {
        //     blocked_time = dto.blocked;
        //     isblocked = true;
        // }



        //
        //  defining variables
        //

        // let blocked = [
        //     {"name": "asd1" ,"start": moment("11:00" ,"HH:mm") ,"end": moment("13:00" ,"HH:mm")},
        //     {"name": "asd2" ,"start": moment("14:00" ,"HH:mm") ,"end": moment("16:00" ,"HH:mm")}
        // ];
        // let start = moment("9:00" ,"HH:mm");
        let start2 = moment(start);
        // let end = moment("17:00" ,"HH:mm");
        let to = moment(start);
        let diff = 0;
        // let tasks = [
        //     {"name": "hello" ,"min": 20 ,"imp": 20},
        //     {"name": "arabic" ,"min": 120 ,"imp": 13},
        //     {"name": "riazi" ,"min": 60 ,"imp": 12},
        // ];
        let tasks2 = [];
        let blocked2 = [ {"name": "" ,"start": moment() ,"end": moment()} ];
        let sorted_tasks = [];
        let m_itr = 0;
        let g_diff = 0;
        let break_flag = false;

        //
        // adjusting the start or end time if they are after or before blocked times
        //

        if(blocked.length != 0 && blocked[0].start.isBefore(start)) {
            start = moment(blocked[0].start);
        } else if(blocked.length != 0 && blocked[blocked.length - 1].end.isAfter(end)) {
            end = blocked[blocked.length - 1].end;
        }

        //
        // sorting blocked times based on their start time
        // sorting tasks based on their importance
        //

        blocked.sort((a ,b) => a.start.toDate() - b.start.toDate());
        tasks.sort((a ,b) => b.imp - a.imp);

        //
        // taking a copy of tasks and blocks to use them in the feature
        //

        tasks2 = JSON.parse(JSON.stringify(tasks));
        blocked2 = JSON.parse(JSON.stringify(blocked));

        //
        // This function checks if the loop continue to appending tasks to the sorted_tasks
        // if the loop should continue it returns true otherwise it returns flase
        //

        function shd_con() {
            let ok = false;
            tasks.map((task) => {
                if(task.min > 5) {
                    ok = true;
                }
            });
            return ok;
        }

        let i = 0;
        for (m_itr = 0;m_itr < 2;m_itr++){

            //
            // The main while loop goes here to append the tasks to the sorted_tasks
            //

            while (shd_con()) {

                //
                // The Default work_time according to the Pomodor Technique is 25 minutes
                //

                let work_len = 25;
                
                //
                // here we check if the whole time of a single task is between 35 and 5
                // if it is, The work_time would be the whole minutes of that task
                // Or if it would turn over the end time ,it just sets the work_time to the remaning time
                //

                if(tasks[i].min < 35 && tasks[i].min > 5) {
                    work_len = tasks[i].min;
                } else if(end.diff(start ,"minutes") < 36) {
                    work_len = end.diff(start ,"minutes");
                    break_flag = true;
                }
                start.add(work_len ,"minutes");

                //
                // If the tasks would crash with a blocked time it appends the blocked time to the sorted_tasks
                // And the appends the task
                //

                if(blocked.length != 0 && (start.isBetween(blocked[0].start ,blocked[0].end) || start.isSameOrAfter(blocked[0].end))) {
                    start.subtract(work_len ,"minutes");
                    diff = start.diff(blocked[0].start ,"minutes");
                    
                    if (diff > 10) {
                        to = moment(blocked[0].start);
                        to.add(diff ,"minutes");
                        sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                        sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                        start = moment(blocked[0].end);
                        to = moment(start);
                        
                        if(start.isSameOrAfter(end)) {
                            sorted_tasks.splice(sorted_tasks.length - 2);
                            break;
                        }
                        
                        tasks[i].min -= diff;
                        start.add(diff + 5 ,"minutes");
                        sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                        to.add(5 ,"minutes");
                    } else {
                        start = moment(blocked[0].end);
                        to = moment(start);
                        sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                        to.add(work_len ,"minutes");
                        sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                        
                        if(start.isSameOrAfter(end)) {
                            sorted_tasks.splice(sorted_tasks.length - 1);
                            break;
                        }
                        
                        tasks[i].min -= work_len;
                        start.add(work_len + 5 ,"minutes");
                        sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                        to = moment(start);
                    }
                    
                    if(blocked.length > 0)
                        blocked.splice(0 ,1);
                
                // Otherwise if it wouldn't crash with the blocked times it just appends the task 
                
                } else {
                    start.subtract(work_len ,"minutes");
                    to = moment(start);
                    to.add(work_len ,"minutes");
                    tasks[i].min -= work_len;
                    sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                    start.add((work_len + 5),"minutes");
                    sorted_tasks.push({"name": "rest" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                }

                //
                // Here we check for all tasks if they have less than 5 minutes remained, delete them
                //

                tasks.map((task ,it) => {
                    if(task.min < 5) {
                        tasks.splice(it ,1);
                        i--;
                    }
                });

                // Go to next iteration
                i++;

                // all last things for breaking from the loop

                if(break_flag)
                    break;
                if(i == tasks.length)
                    i = 0;
                if(tasks.length < 1)
                    break;
            }

            //
            // Here is one of the most important parts of this code
            // At this part we check if the finished has a lot difference from the end time
            // It can either be more than end time or less than end time
            // So here we reset calculate the difference and add (difference / tasks.length) to each task
            // Then reset all needed variables and from the copied vasiables at the first
            // And the jump rigth at the start of the loop again and continue appending to the sorted_tasks
            //

            if(m_itr == 0)
                g_diff = end.diff(to ,"minutes");
            if(g_diff < 5)
                break;
            else
                sorted_tasks = [];
                let quoit = (g_diff / tasks2.length);
                quoit = (Math.round(quoit / 5) * 5);
                g_diff = 0;
                tasks = tasks2;
                blocked2.map((bl: any) => {
                    let s_index = bl.start.indexOf('T');
                    let e_index = bl.end.indexOf('T');
                    bl.start = moment(bl.start.substring(s_index + 1 ,s_index + 6) ,"HH:mm");
                    bl.end = moment(bl.end.substring(e_index + 1 ,e_index + 6) ,"HH:mm");
                    bl.start.add(210 ,"minutes");
                    bl.end.add(210 ,"minutes");
                })
                blocked = blocked2;
                tasks.map((task) => {
                    task.min += quoit;
                })
                start = moment(start2)
                to = moment(start)
        }

        //
        // At the end just check if the last task is rest then delete that
        //

        if(sorted_tasks[sorted_tasks.length - 1].name === "rest") {
            sorted_tasks.pop();
        }

        return sorted_tasks;
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