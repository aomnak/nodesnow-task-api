import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }
}
