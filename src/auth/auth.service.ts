import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/user.model';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    // ส่งข้อมูลให้ UsersService โดยใช้ DTO ที่ได้ปรับปรุงแล้ว
    return this.usersService.createUser({ email, password: hashedPassword });
  }

  async login(loginUserDto: { email: string; password: string }): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // payload สำหรับ JWT ควรมีข้อมูลที่จำเป็นเท่านั้น
    const payload = { sub: user.id, email: user.email };
    const jwtSecret = process.env.JWT_SECRET || 'secretKey'; // อย่าใช้ secret แบบ hard-code ใน production
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    return { access_token: token };
  }
}
