import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface ReviewAttributes {
  ReviewID: number;
  ReviewUserID: number;
  ReviewContentID: number;
  ReviewText: string;
  ReviewRating: number | null;
  ReviewDate: Date;
  ReviewStatus: string;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'ReviewID'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public ReviewID!: number;
  public ReviewUserID!: number;
  public ReviewContentID!: number;
  public ReviewText!: string;
  public ReviewRating!: number | null;
  public ReviewDate!: Date;
  public ReviewStatus!: string;

  public readonly User?: User;

  public static associations: {
    User: Association<Review, User>;
  };
}

Review.init(
  {
    ReviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ReviewUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    ReviewContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
        key: 'ContentID',
      },
    },
    ReviewText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ReviewRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ReviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ReviewStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    timestamps: false,
  }
);

Review.belongsTo(User, { foreignKey: 'ReviewUserID', as: 'User' });

export default Review;
