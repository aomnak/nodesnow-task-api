import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should hash the password and create a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      // simulate bcrypt.hash (เราไม่จำเป็นต้อง mock bcrypt.hash ด้วยตัวเอง แต่สามารถใช้จริงก็ได้)
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

      const createdUser = {
        id: 'some-uuid',
        email: registerUserDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock UsersService.createUser ให้ return createdUser
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await authService.register(registerUserDto);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: registerUserDto.email,
        password: expect.any(String),
      });
      // ตรวจสอบว่า password ที่ส่งเข้าไปไม่ตรงกับ plaintext
      expect(result.password).not.toEqual(registerUserDto.password);
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      // สร้าง user ที่มี password ถูก hash
      const hashed = await bcrypt.hash(loginUserDto.password, 10);
      const user = {
        id: 'some-uuid',
        email: loginUserDto.email,
        password: hashed,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      // Spy on jwt.sign เพื่อให้แน่ใจว่ามันถูกเรียก
      const token = 'jwt.token.example';
      jest.spyOn(jwt, 'sign').mockImplementation(() => token);
      const result = await authService.login(loginUserDto);
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET || 'secretKey',
        { expiresIn: '1h' },
      );
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'plainPassword',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      // สร้าง user ที่มี password ถูก hashจาก "correctPassword"
      const hashed = await bcrypt.hash('correctPassword', 10);
      const user = {
        id: 'some-uuid',
        email: loginUserDto.email,
        password: hashed,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      await expect(authService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
