import { Body, Controller ,Get,Post} from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskDto } from "./dto";

@Controller("plan")
export class TaskController {
    constructor (private taskservice: TaskService) {}
    @Get("task")
    log(@Body() dto: TaskDto) {
        return this.taskservice.addTasks(dto);
    }
}