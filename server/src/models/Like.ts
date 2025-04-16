// src/models/like.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User';
import { ContentAttributes } from './Content';
import Content from './Content';

export interface LikeAttributes {
  LikeID: number;
  LikeUserID: number;
  LikeContentID: number;
  LikeDate: Date;
}


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
        model: 'Users',
        key: 'UserID',
      },
    },
    LikeContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
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
    tableName: 'Likes',
    timestamps: false,
  }
);

Like.belongsTo(Content, {
  foreignKey: 'LikeContentID',
  as: 'Content',
});

export default Like;
