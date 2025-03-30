import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.model';
import { Task } from './tasks/task.model';

@Module({
  imports: [
    ConfigModule.forRoot(), // โหลด environment variables
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres',
      port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'tasks_db',
      models: [User, Task],
      autoLoadModels: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
