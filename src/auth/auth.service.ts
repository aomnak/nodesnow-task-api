import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser({ email, password: hashedPassword });
  }

  async login(loginUserDto: { email: string; password: string }): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new InternalServerErrorException('JWT_SECRET is not defined');

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    return { access_token: token };
  }
}
