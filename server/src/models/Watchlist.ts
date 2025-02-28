// src/models/watchList.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User'; // Импортируем UserAttributes для ссылок
import { ContentAttributes } from './Content'; // Импортируем ContentAttributes для ссылок

// Определяем атрибуты WatchList
export interface WatchListAttributes {
  WatchListID: number;
  WatchListUserID: number;
  WatchListContentID: number;
}

// Определяем тип для создания записи в WatchList, где WatchListID опционален
export interface WatchListCreationAttributes extends Optional<WatchListAttributes, 'WatchListID'> {}

class WatchList extends Model<WatchListAttributes, WatchListCreationAttributes> implements WatchListAttributes {
  public WatchListID!: number;
  public WatchListUserID!: number;
  public WatchListContentID!: number;
}

WatchList.init(
  {
    WatchListID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    WatchListUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Название модели для связи
        key: 'UserID',
      },
    },
    WatchListContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents', // Название модели для связи
        key: 'ContentID',
      },
    },
  },
  {
    sequelize,
    modelName: 'WatchList',
    tableName: 'WatchLists', // Используем множественное число для имени таблицы
    timestamps: false, // Отключаем временные метки
  }
);

export default WatchList;
