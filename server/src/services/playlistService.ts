import Content from '../models/Content';
import Playlist from '../models/Playlist';
import PlaylistContent from '../models/PlaylistContent';


class PlaylistService {
  static async getAllPlaylists(userID: number) {
    try {
      const playlists = await Playlist.findAll({
        where: { PlaylistUserID: userID },
        include: [
          {
            model: PlaylistContent,
            as: 'contents', // Имя alias, указанное в ассоциации
          },
        ],
      });
      return playlists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw new Error('Failed to fetch playlists.');
    }
  }

  // Создание нового плейлиста
  static async createPlaylist(userID: number, name: string, description?: string) {
    const newPlaylist = await Playlist.create({
      PlaylistUserID: userID,
      PlaylistName: name,
      PlaylistDescription: description,
      PlaylistDate: new Date(),
    });
    return newPlaylist;
  }

  // Удаление плейлиста
  static async deletePlaylist(playlistID: number, userID: number) {
    const playlist = await Playlist.findOne({ where: { PlaylistID: playlistID, PlaylistUserID: userID } });
    if (!playlist) {
      throw new Error('Playlist not found or access denied.');
    }
    await playlist.destroy();
  }

  // Добавление контента в плейлист
  static async addContentToPlaylist(playlistID: number, contentID: number) {
    const playlist = await Playlist.findByPk(playlistID);
    if (!playlist) {
      throw new Error('Плейлист не найден.');
    }
  
    const content = await Content.findByPk(contentID);
    if (!content) {
      throw new Error('Контент не найден.');
    }
  
    await PlaylistContent.create({ PlaylistID: playlistID, ContentID: contentID });
}

  // Удаление контента из плейлиста
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
    contentToAdd?: number[], // Массив ID контента для добавления
    contentToRemove?: number[] // Массив ID контента для удаления
) {
    // Найти плейлист
    const playlist = await Playlist.findOne({ where: { PlaylistID: playlistID, PlaylistUserID: userID } });

    if (!playlist) {
      throw new Error('Плейлист не найден или доступ запрещен');
    }

    // Обновление названия и описания
    if (name) playlist.PlaylistName = name;
    if (description) playlist.PlaylistDescription = description;
    await playlist.save();

    // Удаление контента
    if (contentToRemove && contentToRemove.length > 0) {
      await PlaylistContent.destroy({
        where: {
          PlaylistID: playlistID,
          ContentID: contentToRemove,
        },
      });
    }

    // Добавление нового контента
    if (contentToAdd && contentToAdd.length > 0) {
      const playlistContents = contentToAdd.map(contentID => ({
        PlaylistID: playlistID,
        ContentID: contentID,
      }));
      await PlaylistContent.bulkCreate(playlistContents);
    }

    return playlist; // Возвращаем обновленный плейлист
}

  
  static async getPlaylistContent(playlistID: number, userID: number) {
    try {
      const playlist = await Playlist.findOne({
        where: { PlaylistID: playlistID, PlaylistUserID: userID },
        include: [
          {
            model: PlaylistContent,
            as: 'contents', // Алиас для связи с PlaylistContent
            include: [
              {
                model: Content,
                as: 'contentDetails', // Алиас для связи с Content
              },
            ],
          },
        ],
      });

      if (!playlist) {
        throw new Error('Playlist not found or access denied.');
      }

      return playlist;
    } catch (error) {
      console.error('Error fetching playlist content:', error);
      throw new Error('Failed to fetch playlist content.');
    }
  }
  
  
}

export default PlaylistService;
