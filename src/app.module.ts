import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { AppController } from './app.controller';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PlanController } from './plan/plan.controller';
import { PlanService } from './plan/plan.service';

@Module({
  imports: [AuthModule, PrismaModule, PlanModule ,UserModule],
  controllers: [UserController ,AppController ,PlanController],
  providers: [UserService ,PlanService]
})
export class AppModule {}