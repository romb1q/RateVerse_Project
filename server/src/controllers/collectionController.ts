import Playlist from "../models/Playlist";
import User from "../models/User";
import { Request, Response } from 'express';

export const getCollections = async (req: Request, res: Response): Promise<void> => {
    try {
      const collections = await Playlist.findAll({
        where: { IsCollection: true },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['UserName'],
          }
        ],
      });
  
      res.json(collections);
    } catch (error) {
      console.error('Ошибка при получении подборок:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  };