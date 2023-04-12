import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskDto } from "./dto";

@Injectable()
export class TaskService {
    constructor (private prisma: PrismaService) {}

    async addTasks(dto: TaskDto) {
        
    }
}