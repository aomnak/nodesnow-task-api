import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of tasks.' })
  async getTasks(@Request() req) {
    return this.tasksService.getTasks(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific task' })
  @ApiResponse({ status: 200, description: 'Task details.' })
  async getTaskById(@Param('id') id: string, @Request() req) {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.updateTask(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  async deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.deleteTask(id, req.user);
  }
}
