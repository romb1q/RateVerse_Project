import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import PlaylistService from '../services/playlistService';

class PlaylistController {
  static async getAllPlaylists(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, "jwt_secret");
      const userID = (decoded as any).userId;
  
      const playlists = await PlaylistService.getAllPlaylists(userID);
      res.status(200).json(playlists);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCollections(req: Request, res: Response): Promise<void> {
    try {
      const collections = await PlaylistService.getAllCollections();
      res.status(200).json(collections);
    } catch (error) {
      console.error('Ошибка при получении подборок:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static async createPlaylist(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, "jwt_secret");
      const userID = (decoded as any).userId;

      const { name, description, isCollection } = req.body;
      const playlist = await PlaylistService.createPlaylist(userID, name, description, isCollection);
      res.status(201).json(playlist);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePlaylist(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
     return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, "jwt_secret");

    try {
      const { playlistID } = req.params;
      const userID = (decoded as any).userId;
      await PlaylistService.deletePlaylist(Number(playlistID), userID);
      res.status(200).json({ message: 'Playlist deleted successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addContentToPlaylist(req: Request, res: Response): Promise<void> {
    try {
      const { playlistID, contentID } = req.params;

      if (!playlistID || !contentID) {
        res.status(400).json({ error: 'Не указаны необходимые параметры.' });
        return; 
      }

      await PlaylistService.addContentToPlaylist(Number(playlistID), Number(contentID));
      res.status(201).json({ message: 'Content added to playlist.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeContentFromPlaylist(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
     return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, "jwt_secret");

    try {
      const { playlistID, contentID } = req.params;
      
    
    const userID = (decoded as any).userId;
  
      if (!playlistID || !contentID) {
         res.status(400).json({ error: 'playlistID and contentID are required.' });
      }
  
      if (!userID) {
         res.status(400).json({ error: 'UserID is required for authentication.' });
      }
  
      await PlaylistService.removeContentFromPlaylist(Number(playlistID), Number(contentID), Number(userID));
  
       res.status(200).json({ message: 'Content removed from playlist successfully.' });
    } catch (error) {
      console.error(error);
       res.status(500).json({ error: (error as Error).message });
    }
  }
  
  static async updatePlaylist(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, "jwt_secret");
      const userID = (decoded as any).userId;

      const { playlistID } = req.params;
      const { name, description, contentToAdd, contentToRemove } = req.body;

      const updatedPlaylist = await PlaylistService.updatePlaylist(
        userID,
        Number(playlistID),
        name,
        description,
        contentToAdd,
        contentToRemove
      );

      res.status(200).json(updatedPlaylist);
    } catch (error: any) {
      console.error('Ошибка при обновлении плейлиста:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

static async getPlaylistContent(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, "jwt_secret");
    const userID = (decoded as any).userId;

    const { playlistID } = req.params;

    if (!playlistID) {
      res.status(400).json({ error: 'Playlist ID is required.' });
      return;
    }

    const playlistContent = await PlaylistService.getPlaylistContent(Number(playlistID), userID);

    if (!playlistContent) {
      res.status(404).json({ error: 'Playlist not found or access denied.' });
      return;
    }

    res.status(200).json(playlistContent);
  } catch (error: any) {
    console.error('Error fetching playlist content:', error.message);
    res.status(500).json({ error: error.message });
  }
}

  
}

export default PlaylistController;
