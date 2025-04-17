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

  static async createPlaylist(userID: number, name: string, description?: string) {
    const newPlaylist = await Playlist.create({
      PlaylistUserID: userID,
      PlaylistName: name,
      PlaylistDescription: description,
      PlaylistDate: new Date(),
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
        where: { PlaylistID: playlistID, PlaylistUserID: userID },
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
