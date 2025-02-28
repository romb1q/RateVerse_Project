// src/models/rating.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User'; // Импортируем UserAttributes для ссылок
import { ContentAttributes } from './Content'; // Импортируем ContentAttributes для ссылок

// Определяем атрибуты для модели Rating
export interface RatingAttributes {
  RatingID: number;
  RatingUserID: number;
  RatingContentID: number;
  RatingScore: number;
  RatingDate: Date;
}

// Определяем тип для создания записи в модели Rating, где RatingID является опциональным
export interface RatingCreationAttributes extends Optional<RatingAttributes, 'RatingID'> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public RatingID!: number;
  public RatingUserID!: number;
  public RatingContentID!: number;
  public RatingScore!: number;
  public RatingDate!: Date;
}

Rating.init(
  {
    RatingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RatingUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Название модели для связи
        key: 'UserID',
      },
    },
    RatingContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents', // Название модели для связи
        key: 'ContentID',
      },
    },
    RatingScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RatingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'Ratings', // Используем множественное число для имени таблицы
    timestamps: false, // Отключаем временные метки
  }
);

export default Rating;
