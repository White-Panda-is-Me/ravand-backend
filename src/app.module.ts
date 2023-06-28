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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule, PrismaModule, PlanModule ,UserModule ,ServeStaticModule.forRoot({
    rootPath: join(__dirname ,".." ,"/src/html"),
  })],
  controllers: [UserController ,AppController ,PlanController],
  providers: [UserService ,PlanService]
})
export class AppModule {}