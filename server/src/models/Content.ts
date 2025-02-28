import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ContentAttributes {
  ContentID: number;
  ContentType: string;
  ContentName: string;
  ContentImage?: string | null;
  ContentCrew?: string; 
  ContentDescription?: string;
  ContentDate?: Date;
  ContentGenre?: string;
}

export interface ContentCreationAttributes
  extends Optional<ContentAttributes, 'ContentID'> {}

class Content
  extends Model<ContentAttributes, ContentCreationAttributes>
  implements ContentAttributes
{
  public ContentID!: number;
  public ContentType!: string;
  public ContentName!: string;
  public ContentImage?: string | null;
  public ContentCrew?: string;
  public ContentDescription?: string;
  public ContentDate?: Date;
  public ContentGenre?: string;
}
Content.init(
  {
    ContentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ContentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ContentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ContentImage: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    ContentCrew: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ContentDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ContentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ContentGenre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Content',
    tableName: 'Contents',
    timestamps: false,
  }
);



export default Content;
