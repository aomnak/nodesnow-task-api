import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return user data', async () => {
      const registerDto: RegisterUserDto = { 
        email: 'test@example.com', 
        password: 'mypassword' 
      };
      const resultUser = { 
        id: 'some-uuid', 
        email: registerDto.email, 
        password: 'hashedpassword', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };

      (authService.register as jest.Mock).mockResolvedValue(resultUser);

      expect(await authController.register(registerDto)).toEqual(resultUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const loginDto: LoginUserDto = { 
        email: 'test@example.com', 
        password: 'mypassword' 
      };
      const tokenResult = { access_token: 'jwt_token' };

      (authService.login as jest.Mock).mockResolvedValue(tokenResult);

      expect(await authController.login(loginDto)).toEqual(tokenResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginUserDto = { 
        email: 'wrong@example.com', 
        password: 'wrongpassword' 
      };

      (authService.login as jest.Mock).mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
