import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../users/user.model';

export interface TaskAttributes {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  userId: string;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'status'> {}

@Table
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false })
  title: string;

  @Column(DataType.STRING)
  description: string;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  })
  status: 'pending' | 'in_progress' | 'completed';

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  userId: string;
}
