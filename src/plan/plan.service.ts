import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DelPlanDto ,PlanDto } from './dto';
import * as moment from "moment";
import { ChildPlanDto } from 'src/auth/dto';
import { log } from 'console';

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

    private async SavePlan(tasks: string ,usrId: number) {
        await this.prisma.plan.create({
            data: {
                UserId: usrId,
                Tasks: tasks,
            }
        });
    }

    private DividePlan(dto: PlanDto) {
        let tasks = dto.tasks;
        let start = moment(dto.start ,"HH:mm");
        let end = moment(dto.end ,"HH:mm");
        let blocked = dto.blocked;
        dto.blocked.map((bl ,i) => {
            blocked[i].start = moment(bl.start ,"HH:mm");
            blocked[i].end = moment(bl.end ,"HH:mm");
        });

        //
        //  defining variables
        //

        let start2 = moment(start);
        let to = moment(start);
        let diff = 0;
        let shd_loop = dto.loop;
        let tasks2 = [];
        let blocked2 = [];
        let sorted_tasks = [];
        let m_itr = 0;
        let g_diff = 0;
        let break_flag = false;
        let block_bug_flag = false;
        
        function edit_end() {
            let itr = sorted_tasks.length - 1;
            let from = moment(sorted_tasks[itr].from ,"HH:mm");
            let to = moment(sorted_tasks[itr].to ,"HH:mm");
        
            while(1 && shd_loop){
                if(to.isAfter(end) && from.isBefore(end)) {
                    sorted_tasks[itr].to = end.format("HH:mm");
                    break;
                } else if(to.isAfter(end)) {
                    sorted_tasks.splice(sorted_tasks.length - 1 , 1);
                    itr--;
                    to = moment(sorted_tasks[itr].to ,"HH:mm");
                } else {
                    if(sorted_tasks[itr].name == "استراحت"){
                        sorted_tasks.splice(sorted_tasks.length - 1 , 1);
                        itr--;
                        to = moment(sorted_tasks[itr].to ,"HH:mm");
                    }
                    sorted_tasks[itr].to = end.format("HH:mm");
                    break;
                }
            }
        
            if(from.diff(to ,"minutes") < 9 && from.diff(to ,"minutes") > -9) {
                sorted_tasks.pop();
                sorted_tasks.pop();
                itr -= 2;
                sorted_tasks[itr].to = to.format("HH:mm");
            }
        }
        
        
        //
        // adjusting the start or end time if they are after or before blocked times
        //
        
        if(blocked.length != 0 && blocked[0].start.isBefore(start)) {
            start = moment(blocked[0].end);
            to = moment(start);
            block_bug_flag = true;
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
            if(block_bug_flag) {
                sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                start = moment(blocked[0].end);
                to = moment(start);
                blocked.splice(0 ,1);
            }
        
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
        
                if(blocked.length != 0 && (start.isBetween(blocked[0].start ,blocked[0].end) || start.isSameOrAfter(blocked[0].start))) {
                    start.subtract(work_len ,"minutes");
                    diff = start.diff(blocked[0].start ,"minutes");
                    if (diff > 10) {
                        to = moment(blocked[0].start);
                        to.add(diff ,"minutes");
                        sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                        if(sorted_tasks[sorted_tasks.length - 1].name == "استراحت") {
                            sorted_tasks.splice(sorted_tasks.length - 1 ,1);
                        }
                        sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                        start = moment(blocked[0].end);
                        to = moment(start);
                        
                        if(start.isSameOrAfter(end)) {
                            sorted_tasks.splice(sorted_tasks.length - 2);
                            break;
                        }
                        
                        tasks[i].min -= diff;
                        start.add(diff + 5 ,"minutes");
                        sorted_tasks.push({"name": "استراحت" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
                        to.add(5 ,"minutes");
                    } else {
                        start = moment(blocked[0].end);
                        to = moment(start);
                        if(sorted_tasks.length != 0 && sorted_tasks[sorted_tasks.length - 1].name == "استراحت") {
                            sorted_tasks.splice(sorted_tasks.length - 1 ,1);
                        }
                        sorted_tasks.push({"name": blocked[0].name ,"from": blocked[0].start.format("HH:mm") ,"to": blocked[0].end.format("HH:mm")});
                        to.add(work_len ,"minutes");
                        sorted_tasks.push({"name": tasks[i].name ,"from": start.format("HH:mm") ,"to": to.format("HH:mm")});
                        
                        if(start.isSameOrAfter(end)) {
                            sorted_tasks.splice(sorted_tasks.length - 1);
                            break;
                        }
                        
                        tasks[i].min -= work_len;
                        start.add(work_len + 5 ,"minutes");
                        sorted_tasks.push({"name": "استراحت" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
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
                    sorted_tasks.push({"name": "استراحت" ,"from": to.format("HH:mm") ,"to": start.format("HH:mm")});
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
            if((g_diff < 5 && g_diff > -5) || !shd_loop)
                break;
            else
                sorted_tasks = [];
                let quoit = (g_diff / tasks2.length);
                quoit = (Math.round(quoit / 5) * 5);
                g_diff = 0;
                tasks = tasks2;
                blocked2.map((bl) => {
                    let s_index = bl.start.indexOf('T');
                    let e_index = bl.end.indexOf('T');
                    bl.start = moment(bl.start.substring(s_index + 1 ,s_index + 6) ,"HH:mm");
                    bl.end = moment(bl.end.substring(e_index + 1 ,e_index + 6) ,"HH:mm");
                });
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
        
        if(sorted_tasks[sorted_tasks.length - 1].name === "استراحت") {
            sorted_tasks.pop();
        }
        
        //
        //  printing sorted tasks
        //
        
        edit_end();
        
        return sorted_tasks;
    }

    async CreatePlan(dto: PlanDto ,usrid: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: usrid
            }
        });
        if(!user) 
            throw new HttpException("user doesn't exist" ,404);
        this.SavePlan(JSON.stringify(dto) ,usrid);
        return this.DividePlan(dto);
        
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

    async GetChildPlan(dto: ChildPlanDto ,id: number) {
        const rel = await this.prisma.childreq.findUnique({
            where: {
                id: dto.reqid,
            },
        });
        if(rel.ParentId == id) {
            if(!rel)
                throw new HttpException("relation doesn't exist!" ,409);
            if(rel.Accepted) {
                const plan = await this.prisma.plan.findFirst({
                    where: {
                        UserId: rel.ChildId,
                    },
                });
                if(!plan)
                    return [];
                let dto = new PlanDto();
                dto.blocked = JSON.parse(plan.Tasks.toString()).blocked;
                dto.start   = JSON.parse(plan.Tasks.toString()).start;
                dto.end     = JSON.parse(plan.Tasks.toString()).end;
                dto.tasks   = JSON.parse(plan.Tasks.toString()).tasks;
                dto.loop    = JSON.parse(plan.Tasks.toString()).loop;
                return this.DividePlan(dto);
            } else {
                throw new HttpException("The User has not accpeted you request!" ,405);
            }
        } else {
            throw new HttpException("You are not a parent" ,406);
        }
    }
}
