// src/models/view.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User';
import { ContentAttributes } from './Content';
import Content from './Content';



export interface ViewAttributes {
  ViewID: number;
  ViewUserID: number;
  ViewContentID: number;
  ViewDate: Date;
}


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
        model: 'Users', 
        key: 'UserID',
      },
    },
    ViewContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
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
    tableName: 'Views',
    timestamps: false,
  }
);

View.belongsTo(Content, {
  foreignKey: 'ViewContentID',
  as: 'Content',
});

export default View;
