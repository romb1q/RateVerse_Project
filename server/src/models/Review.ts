import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// Определяем атрибуты Review
export interface ReviewAttributes {
  ReviewID: number;
  ReviewUserID: number;
  ReviewContentID: number;
  ReviewText: string;
  ReviewRating: number | null;
  ReviewDate: Date;
  ReviewStatus: string;
}

// Тип для создания Review, где ReviewID опционален
export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'ReviewID'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public ReviewID!: number;
  public ReviewUserID!: number;
  public ReviewContentID!: number;
  public ReviewText!: string;
  public ReviewRating!: number | null;
  public ReviewDate!: Date;
  public ReviewStatus!: string;

  // Добавляем ассоциацию
  public readonly User?: User;

  // Определяем статическую ассоциацию
  public static associations: {
    User: Association<Review, User>;
  };
}

// Инициализация модели
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
        model: 'Users', // Таблица пользователей
        key: 'UserID',
      },
    },
    ReviewContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents', // Таблица контента
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

// Устанавливаем связь с User
Review.belongsTo(User, { foreignKey: 'ReviewUserID', as: 'User' });

export default Review;
