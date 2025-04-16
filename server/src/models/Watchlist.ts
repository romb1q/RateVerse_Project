// src/models/watchList.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User';
import { ContentAttributes } from './Content';
import Content from './Content';

export interface WatchListAttributes {
  WatchListID: number;
  WatchListUserID: number;
  WatchListContentID: number;
  WatchListDate: Date;
}

export interface WatchListCreationAttributes extends Optional<WatchListAttributes, 'WatchListID' | 'WatchListDate'> {}

class WatchList extends Model<WatchListAttributes, WatchListCreationAttributes> implements WatchListAttributes {
  public WatchListID!: number;
  public WatchListUserID!: number;
  public WatchListContentID!: number;
  public WatchListDate!: Date;
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
        model: 'Users',
        key: 'UserID',
      },
    },
    WatchListContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
        key: 'ContentID',
      },
    },
    WatchListDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'WatchList',
    tableName: 'WatchLists',
    timestamps: false,
  }
);

WatchList.belongsTo(Content, {
  foreignKey: 'WatchListContentID',
  as: 'Content',
});

export default WatchList;
