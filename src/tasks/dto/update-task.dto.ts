import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Updated Task Title',
    description: 'New title for the task',
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiPropertyOptional({
    example: 'Updated description for the task.',
    description: 'New description for the task',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({
    example: 'in_progress',
    description: 'Status of the task',
    enum: ['pending', 'in_progress', 'completed'],
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed'])
  readonly status?: 'pending' | 'in_progress' | 'completed';
}
