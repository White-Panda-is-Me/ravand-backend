import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
  providers: [PlanService],
  controllers: [PlanController],
})
export class TaskModule {}
