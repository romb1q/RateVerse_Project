// src/models/user.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  UserID: number;
  UserName: string;
  UserPassword: string;
  UserRole: string;
  UserStatus: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'UserID'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public UserID!: number;
  public UserName!: string;
  public UserPassword!: string;
  public UserRole!: string;
  public UserStatus!: string;
}

User.init(
  {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
  }
);

export default User;
