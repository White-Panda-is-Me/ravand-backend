import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DelPlanDto, EditPlanDto, GetPlanDto, PlanDto } from './dto';
import { PlanService } from './plan.service';

@Controller('task')
export class PlanController {
    constructor(private taskService: PlanService) {}

    // @Post("create")
    // Create(@Body() dto: PlanDto) {
    //     return this.taskService.CreatePlan(dto);
    // }

    @Put("edit")
    Edit(@Body() dto: EditPlanDto) {
        return this.taskService.EditPlan(dto);
    }

    @Delete("del")
    Delete(@Body() dto: DelPlanDto) {
        return this.taskService.DelPlan(dto);
    }

    @Get("all")
    GetTasks(@Body() dto: GetPlanDto) {
        return this.taskService.GetPlans(dto);
    }
}