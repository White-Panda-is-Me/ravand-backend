import { Body, Controller, Get ,Post ,Request } from '@nestjs/common';
import { PlanDto } from './dto';
import { PlanService } from './plan.service';
import { AuthUser } from "./decorator/dec.plan";

@Controller('plan')
export class PlanController {
    constructor(private taskService: PlanService) {}

    @Post("create")
    Create(@Body() dto: PlanDto ,@AuthUser() id: number) {
        console.log(dto);
        // return this.taskService.CreatePlan(dto ,id);
    }

    // @Put("edit")
    // Edit(@Body() dto: EditPlanDto ,@Request() req) {
    //     return this.taskService.EditPlan(dto ,req.user.userid);
    // }

    // @Delete("del")
    // Delete(@Body() dto: DelPlanDto ,@Request() req) {
    //     return this.taskService.DelPlan(dto ,req.user.userid);
    // }

    @Get("all")
    GetTasks(@AuthUser() id: number) {
        return this.taskService.GetPlans(id);
    }
}