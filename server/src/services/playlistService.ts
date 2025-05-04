import Content from '../models/Content';
import Playlist from '../models/Playlist';
import PlaylistContent from '../models/PlaylistContent';
import User from '../models/User';


class PlaylistService {
  static async getAllPlaylists(userID: number) {


    try {
      const playlists = await Playlist.findAll({
        where: { PlaylistUserID: userID },
        include: [
          {
            model: PlaylistContent,
            as: 'contents',
          },
        ],
      });
      return playlists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw new Error('Failed to fetch playlists.');
    }
  }

  static async getAllCollections() {
    try {
      const collections = await Playlist.findAll({
        where: { IsCollection: true },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['UserName'],
          },
        ],
      });
      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections.');
    }
  }

  static async createPlaylist(userID: number, name: string, description?: string, isCollection = false) {
    const user = await User.findByPk(userID);

    if (!user) throw new Error('Пользователь не найден');

    if (isCollection && user.UserRole !== 'admin') {
      throw new Error('Только админы могут создавать подборки');
    }
    const newPlaylist = await Playlist.create({
      PlaylistUserID: userID,
      PlaylistName: name,
      PlaylistDescription: description,
      PlaylistDate: new Date(),
      IsCollection: isCollection,
    });
    return newPlaylist;
  }

  static async deletePlaylist(playlistID: number, userID: number) {
    const playlist = await Playlist.findOne({ where: { PlaylistID: playlistID, PlaylistUserID: userID } });
    if (!playlist) {
      throw new Error('Playlist not found or access denied.');
    }
    await playlist.destroy();
  }

  static async addContentToPlaylist(playlistID: number, contentID: number) {
    const playlist = await Playlist.findByPk(playlistID);
    if (!playlist) {
      throw new Error('Плейлист не найден.');
    }

    /*if (playlist.PlaylistUserID !== userID) {
      throw new Error('Access denied: you are not the owner of this playlist.');
    }*/
  
    const content = await Content.findByPk(contentID);
    if (!content) {
      throw new Error('Контент не найден.');
    }
  
    await PlaylistContent.create({ PlaylistID: playlistID, ContentID: contentID });
}

  static async removeContentFromPlaylist(playlistID: number, contentID: number, userID: number) {
    const playlist = await Playlist.findOne({ where: { PlaylistID: playlistID, PlaylistUserID: userID } });
    if (!playlist) {
      throw new Error('Playlist not found or access denied.');
    }
  
    const content = await PlaylistContent.findOne({ where: { PlaylistID: playlistID, ContentID: contentID } });
    if (!content) {
      throw new Error('Content not found in playlist.');
    }
  
    await content.destroy();
  }

  static async updatePlaylist(
    userID: number,
    playlistID: number,
    name?: string,
    description?: string,
    contentToAdd?: number[],
    contentToRemove?: number[]
) {
    const playlist = await Playlist.findOne({ where: { PlaylistID: playlistID, PlaylistUserID: userID } });

    if (!playlist) {
      throw new Error('Плейлист не найден или доступ запрещен');
    }

    if (name) playlist.PlaylistName = name;
    if (description) playlist.PlaylistDescription = description;
    await playlist.save();

    if (contentToRemove && contentToRemove.length > 0) {
      await PlaylistContent.destroy({
        where: {
          PlaylistID: playlistID,
          ContentID: contentToRemove,
        },
      });
    }

    if (contentToAdd && contentToAdd.length > 0) {
      const playlistContents = contentToAdd.map(contentID => ({
        PlaylistID: playlistID,
        ContentID: contentID,
      }));
      await PlaylistContent.bulkCreate(playlistContents);
    }

    return playlist;
}

  
  static async getPlaylistContent(playlistID: number, userID: number) {
    try {
      const playlist = await Playlist.findOne({
        where: { PlaylistID: playlistID },
        include: [
          {
            model: PlaylistContent,
            as: 'contents',
            include: [
              {
                model: Content,
                as: 'contentDetails',
              },
            ],
          },
        ],
        attributes: ['PlaylistID', 'PlaylistName', 'PlaylistUserID', 'PlaylistDescription', 'IsCollection'],
      });

      if (!playlist) {
        throw new Error('Playlist not found or access denied.');
      }

      if (!playlist.IsCollection && playlist.PlaylistUserID !== userID) {
        throw new Error('Access denied.');
      }

      return playlist;
    } catch (error) {
      console.error('Error fetching playlist content:', error);
      throw new Error('Failed to fetch playlist content.');
    }
  }
  
  
}

export default PlaylistService;
