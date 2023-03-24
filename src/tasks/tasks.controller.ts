import { Controller , Delete, Post , Body, Patch} from '@nestjs/common';
import { DelTaskDto, EditTaskDto, TasksDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskservice: TasksService) {}

    @Post("Add")
    Add(taskDto: TasksDto) {
        return this.taskservice.Add(taskDto);
    }

    @Delete("Delete")
    Delete(@Body() dto: DelTaskDto) {
        return this.taskservice.Delete(dto);
    }

    @Patch("Edit")
    Edit(userId: number ,@Body() dto: EditTaskDto) {
        return this.taskservice.Edit(userId ,dto);
    }
}
