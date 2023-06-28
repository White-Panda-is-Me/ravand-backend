import { Body, Controller, Get ,HttpCode,Post ,Request } from '@nestjs/common';
import { PlanDto } from './dto';
import { PlanService } from './plan.service';
import { AuthUser } from "./decorator/dec.plan";
import { ChildPlanDto } from 'src/auth/dto';

@Controller('plan')
export class PlanController {
    constructor(private taskService: PlanService) {}

    @HttpCode(200)
    @Post("create")
    Create(@Body() dto: PlanDto ,@AuthUser() id: number) {
        return this.taskService.CreatePlan(dto ,id);
    }

    @Post("child")
    ChildReq(@Body() dto: ChildPlanDto ,@AuthUser() id: number) {
        return this.taskService.GetChildPlan(dto ,id);
    }

    @Get("all")
    GetTasks(@AuthUser() id: number) {
        return this.taskService.GetPlans(id);
    }
}