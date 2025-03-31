import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './user.model';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: any;

  beforeEach(async () => {
    // Create a mock object for the User model
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: userModel },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 'some-uuid',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userModel.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(usersService.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create a new user when email does not exist', async () => {
      const createUserDto = { email: 'new@example.com', password: 'password' };

      userModel.findOne.mockResolvedValue(null);
      const createdUser = { id: 'new-uuid', ...createUserDto, createdAt: new Date(), updatedAt: new Date() };
      userModel.create.mockResolvedValue(createdUser);

      const result = await usersService.createUser(createUserDto);
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = { email: 'exists@example.com', password: 'password' };
      const existingUser = { id: 'existing-uuid', ...createUserDto };

      userModel.findOne.mockResolvedValue(existingUser);

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
      
    it('should rethrow an error if userModel.create fails', async () => {
      const createUserDto = { email: 'dbfail@example.com', password: 'password' };
    
      // Mock findOne to simulate no duplicate user found
      userModel.findOne.mockResolvedValue(null);
    
      userModel.create.mockRejectedValue(new Error('DB Error'));
    
      await expect(usersService.createUser(createUserDto)).rejects.toThrow('DB Error');
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
