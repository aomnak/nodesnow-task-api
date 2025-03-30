import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ unique: true, allowNull: false })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;
}
