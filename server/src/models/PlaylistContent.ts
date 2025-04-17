import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Playlist from './Playlist';
import Content from './Content';

export interface PlaylistContentAttributes {
  PlaylistID: number;
  ContentID: number;
}

class PlaylistContent extends Model<PlaylistContentAttributes> implements PlaylistContentAttributes {
  public PlaylistID!: number;
  public ContentID!: number;
}

PlaylistContent.init(
  {
    PlaylistID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Playlists',
        key: 'PlaylistID',
      },
      primaryKey: true,
    },
    ContentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contents',
        key: 'ContentID',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'PlaylistContent',
    tableName: 'PlaylistContents',
    timestamps: false,
  }
);

PlaylistContent.belongsTo(Content, {
  foreignKey: 'ContentID',
  as: 'contentDetails',
});

export default PlaylistContent;
