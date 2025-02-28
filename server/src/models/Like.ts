// src/models/like.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User'; // Импортируем UserAttributes для ссылок
import { ContentAttributes } from './Content'; // Импортируем ContentAttributes для ссылок

// Определяем атрибуты лайка
export interface LikeAttributes {
  LikeID: number;
  LikeUserID: number;
  LikeContentID: number;
  LikeDate: Date;
}

// Определяем тип для создания лайка, где LikeID опционален
export interface LikeCreationAttributes extends Optional<LikeAttributes, 'LikeID'> {}

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
  public LikeID!: number;
  public LikeUserID!: number;
  public LikeContentID!: number;
  public LikeDate!: Date;
}

Like.init(
  {
    LikeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    LikeUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Название модели для связи
        key: 'UserID',
      },
    },
    LikeContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents', // Название модели для связи
        key: 'ContentID',
      },
    },
    LikeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes', // Лучше использовать множественное число для имени таблицы
    timestamps: false, // Если нет полей createdAt/updatedAt в таблице
  }
);

export default Like;
