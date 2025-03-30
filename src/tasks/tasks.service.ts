import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: any): Promise<Task> {
    return this.taskModel.create({ ...createTaskDto, userId: user.userId });
  }

  async getTasks(user: any): Promise<Task[]> {
    return this.taskModel.findAll({ where: { userId: user.userId } });
  }

  async getTaskById(id: string, user: any): Promise<Task> {
    const task = await this.taskModel.findOne({ where: { id, userId: user.userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: any): Promise<Task> {
    const task = await this.getTaskById(id, user);
    return task.update(updateTaskDto);
  }

  async deleteTask(id: string, user: any): Promise<void> {
    const task = await this.getTaskById(id, user);
    await task.destroy();
  }
}
