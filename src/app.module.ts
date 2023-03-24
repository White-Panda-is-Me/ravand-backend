import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, PrismaModule ,ServeStaticModule.forRoot({
    rootPath: join(__dirname ,"../../front"),
  }), TasksModule],
  controllers: [UserController ,AppController],
})
export class AppModule {}