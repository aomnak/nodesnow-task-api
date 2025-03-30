import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'mypassword',
    description: 'Password for the user (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
