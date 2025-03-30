import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'New Task',
    description: 'Title of the task',
  })
  @IsString()
  readonly title: string;

  @ApiPropertyOptional({
    example: 'Task details...',
    description: 'Optional description of the task',
  })
  @IsString()
  readonly description?: string;
}
