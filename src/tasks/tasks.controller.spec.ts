import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: Partial<TasksService>;

  beforeEach(async () => {
    tasksService = {
      createTask: jest.fn().mockResolvedValue({ id: 'task-uuid', title: 'New Task', description: 'Task details', status: 'pending', userId: 'user-uuid', createdAt: new Date(), updatedAt: new Date() }),
      getTasks: jest.fn().mockResolvedValue([
        { id: 'task1', title: 'Task 1', description: 'Detail 1', status: 'pending', userId: 'user-uuid' },
      ]),
      getTaskById: jest.fn().mockResolvedValue({ id: 'task-uuid', title: 'Task', description: 'Detail', status: 'pending', userId: 'user-uuid' }),
      updateTask: jest.fn().mockResolvedValue({ id: 'task-uuid', title: 'Updated Title', description: 'Updated Description', status: 'in_progress', userId: 'user-uuid', createdAt: new Date(), updatedAt: new Date() }),
      deleteTask: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: tasksService },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
  });

  it('should create a new task', async () => {
    const createTaskDto: CreateTaskDto = { title: 'New Task', description: 'Task details' };
    const user = { userId: 'user-uuid' };
    const result = await tasksController.createTask(createTaskDto, { user });
    expect(result).toHaveProperty('id');
    expect(tasksService.createTask).toHaveBeenCalledWith(createTaskDto, user);
  });

  it('should get tasks for the user', async () => {
    const user = { userId: 'user-uuid' };
    const result = await tasksController.getTasks({ user });
    expect(Array.isArray(result)).toBe(true);
    expect(tasksService.getTasks).toHaveBeenCalledWith(user);
  });

  it('should get a task by id', async () => {
    const user = { userId: 'user-uuid' };
    const taskId = 'task-uuid';
    const result = await tasksController.getTaskById(taskId, { user });
    expect(result).toHaveProperty('id', taskId);
    expect(tasksService.getTaskById).toHaveBeenCalledWith(taskId, user);
  });

  it('should update a task', async () => {
    const user = { userId: 'user-uuid' };
    const taskId = 'task-uuid';
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Title',
      description: 'Updated Description',
      status: 'in_progress' as 'in_progress',
    };
    const result = await tasksController.updateTask(taskId, updateTaskDto, { user });
    expect(result).toHaveProperty('title', 'Updated Title');
    expect(tasksService.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto, user);
  });

  it('should delete a task', async () => {
    const user = { userId: 'user-uuid' };
    const taskId = 'task-uuid';
    const result = await tasksController.deleteTask(taskId, { user });
    expect(result).toBeUndefined();
    expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId, user);
  });
});
