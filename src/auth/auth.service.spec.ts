import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const dto = { email: 'test@example.com', password: 'plain' };
      const hashed = await bcrypt.hash(dto.password, 10);

      (usersService.createUser as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        password: hashed,
      });

      const result = await authService.register(dto);

      expect(usersService.createUser).toHaveBeenCalledWith({
        email: dto.email,
        password: expect.any(String),
      });
      expect(result.password).not.toBe(dto.password);
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const dto = { email: 'test@example.com', password: 'plain' };
      const hashed = await bcrypt.hash(dto.password, 10);
      const user = { id: '1', email: dto.email, password: hashed };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      const signSpy = (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue('token');

      const result = await authService.login(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(signSpy).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'a@a.com', password: 'test' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('correct', 10),
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      await expect(
        authService.login({ email: user.email, password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException if JWT_SECRET is missing', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('test', 10),
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (configService.get as jest.Mock).mockReturnValue(undefined);

      await expect(
        authService.login({ email: user.email, password: 'test' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
