import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/sequelize';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskModel: any;

  beforeEach(async () => {
    // สร้าง mock object สำหรับ Task model
    taskModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task), useValue: taskModel },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto = { title: 'New Task', description: 'Task details' };
      const user = { userId: 'user-uuid' };
      const createdTask = {
        id: 'task-uuid',
        ...createTaskDto,
        status: 'pending',
        userId: user.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        update: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      taskModel.create.mockResolvedValue(createdTask);
      const result = await tasksService.createTask(createTaskDto, user);
      expect(taskModel.create).toHaveBeenCalledWith({ ...createTaskDto, userId: user.userId });
      expect(result).toEqual(createdTask);
    });
  });

  describe('getTasks', () => {
    it('should return an array of tasks for the user', async () => {
      const user = { userId: 'user-uuid' };
      const tasks = [
        { id: 'task1', title: 'Task 1', description: 'Detail 1', status: 'pending', userId: user.userId },
        { id: 'task2', title: 'Task 2', description: 'Detail 2', status: 'pending', userId: user.userId },
      ];
      taskModel.findAll.mockResolvedValue(tasks);
      const result = await tasksService.getTasks(user);
      expect(taskModel.findAll).toHaveBeenCalledWith({ where: { userId: user.userId } });
      expect(result).toEqual(tasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task if found', async () => {
      const user = { userId: 'user-uuid' };
      const taskId = 'task-uuid';
      const task = { id: taskId, title: 'Task', description: 'Detail', status: 'pending', userId: user.userId };
      taskModel.findOne.mockResolvedValue(task);
      const result = await tasksService.getTaskById(taskId, user);
      expect(taskModel.findOne).toHaveBeenCalledWith({ where: { id: taskId, userId: user.userId } });
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      const user = { userId: 'user-uuid' };
      const taskId = 'nonexistent-task';
      taskModel.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(taskId, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('should update a task and return the updated task', async () => {
      const user = { userId: 'user-uuid' };
      const taskId = 'task-uuid';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'in_progress' as 'in_progress',
      };
  
      // สร้าง mock task object พร้อม method update
      const mockTask = {
        id: taskId,
        title: 'Old Title',
        description: 'Old Description',
        status: 'pending',
        userId: user.userId,
        update: jest.fn().mockResolvedValue({ ...updateTaskDto, id: taskId, userId: user.userId, updatedAt: new Date(), createdAt: new Date() }),
      };
  
      // ให้ getTaskById คืนค่า mockTask
      taskModel.findOne.mockResolvedValue(mockTask);
  
      const result = await tasksService.updateTask(taskId, updateTaskDto, user);
      expect(taskModel.findOne).toHaveBeenCalledWith({ where: { id: taskId, userId: user.userId } });
      expect(mockTask.update).toHaveBeenCalledWith(updateTaskDto);
      expect(result).toEqual(expect.objectContaining(updateTaskDto));
    });
  });  

  describe('deleteTask', () => {
    it('should delete the task', async () => {
      const user = { userId: 'user-uuid' };
      const taskId = 'task-uuid';

      // สร้าง mock task object พร้อม method destroy
      const mockTask = {
        id: taskId,
        title: 'Task',
        description: 'Detail',
        status: 'pending',
        userId: user.userId,
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      taskModel.findOne.mockResolvedValue(mockTask);
      await tasksService.deleteTask(taskId, user);
      expect(taskModel.findOne).toHaveBeenCalledWith({ where: { id: taskId, userId: user.userId } });
      expect(mockTask.destroy).toHaveBeenCalled();
    });
  });
});
