import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import PlaylistContent from './PlaylistContent';
import User from './User';

export interface PlaylistAttributes {
  PlaylistID: number;
  PlaylistUserID: number;
  PlaylistName: string;
  PlaylistDescription?: string;
  PlaylistDate: Date;
  IsCollection: boolean;
}

export interface PlaylistCreationAttributes extends Optional<PlaylistAttributes, 'PlaylistID'> {}

class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> implements PlaylistAttributes {
  public PlaylistID!: number;
  public PlaylistUserID!: number;
  public PlaylistName!: string;
  public PlaylistDescription?: string;
  public PlaylistDate!: Date;
  public IsCollection!: boolean;
}

Playlist.init(
  {
    PlaylistID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PlaylistUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    PlaylistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PlaylistDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PlaylistDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    IsCollection: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Playlist',
    tableName: 'Playlists',
    timestamps: false,
  }
);

Playlist.hasMany(PlaylistContent, { foreignKey: 'PlaylistID', as: 'contents' });

Playlist.belongsTo(User, { foreignKey: 'PlaylistUserID' });

export default Playlist;
