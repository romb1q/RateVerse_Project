// src/models/rating.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './User';
import { ContentAttributes } from './Content';

export interface RatingAttributes {
  RatingID: number;
  RatingUserID: number;
  RatingContentID: number;
  RatingScore: number;
  RatingDate: Date;
}

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
        model: 'Users',
        key: 'UserID',
      },
    },
    RatingContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
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
    tableName: 'Ratings',
    timestamps: false,
  }
);

export default Rating;
