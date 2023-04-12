import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { AppController } from './app.controller';
import { TaskModule } from './plan/plan.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TaskController } from './plan/task/task.controller';
import { TaskService } from './plan/task/task.service';

@Module({
  imports: [AuthModule, PrismaModule, TaskModule ,UserModule ,TaskModule],
  controllers: [UserController ,AppController ,TaskController],
  providers: [UserService ,TaskService]
})
export class AppModule {}