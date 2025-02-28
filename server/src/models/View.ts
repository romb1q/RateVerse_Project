// src/models/view.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User'; // Импортируем UserAttributes для ссылок
import { ContentAttributes } from './Content'; // Импортируем ContentAttributes для ссылок

// Определяем атрибуты просмотра
export interface ViewAttributes {
  ViewID: number;
  ViewUserID: number;
  ViewContentID: number;
  ViewDate: Date;
}

// Определяем тип для создания просмотра, где ViewID опционален
export interface ViewCreationAttributes extends Optional<ViewAttributes, 'ViewID'> {}

class View extends Model<ViewAttributes, ViewCreationAttributes> implements ViewAttributes {
  public ViewID!: number;
  public ViewUserID!: number;
  public ViewContentID!: number;
  public ViewDate!: Date;
}

View.init(
  {
    ViewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ViewUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Название модели для связи
        key: 'UserID',
      },
    },
    ViewContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents', // Название модели для связи
        key: 'ContentID',
      },
    },
    ViewDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'View',
    tableName: 'Views', // Используем множественное число для имени таблицы
    timestamps: false, // Если в таблице нет полей createdAt/updatedAt
  }
);

export default View;
