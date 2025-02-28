import { Request, Response } from 'express';
import WatchList from '../models/Watchlist';


export const createWatchList = async (req: Request, res: Response): Promise<void> => {
    const { WatchListUserID, WatchListContentID } = req.body;

    if (!WatchListUserID || !WatchListContentID) {
        res.status(400).json({ message: 'WatchListUserID and WatchListContentID are required' });
        return;
    }

    try {
        
        const existingWatchList = await WatchList.findOne({
            where: { WatchListUserID, WatchListContentID },
        });

        if (existingWatchList) {
        
          await existingWatchList.destroy();
          res.status(200).json({ message: 'Удаление из желаемого' });
      } else {
        
          const newWatchList = await WatchList.create({ WatchListUserID, WatchListContentID});
          res.status(201).json(newWatchList);
      }
    } catch (error) {
        console.error('Ошибка создания желаемого:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};


export const removeWatchList = async (req: Request, res: Response): Promise<void> => {
    const { WatchListUserID, WatchListContentID } = req.body;

    if (!WatchListUserID || !WatchListContentID) {
        res.status(400).json({ message: 'WatchListUserID and WatchListContentID are required' });
        return;
    }

    try {
        const watchlist = await WatchList.findOne({
            where: { WatchListUserID, WatchListContentID },
        });

        if (!watchlist) {
            res.status(404).json({ message: 'Желаемое не найдено' });
            return;
        }

        await watchlist.destroy();
        res.status(200).json({ message: 'Желаемое удалено' });
    } catch (error) {
        console.error('Ошибка удаления просмотра:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};


export const findWatchList = async (req: Request, res: Response): Promise<void> => {
    const { WatchListUserID, WatchListContentID } = req.query;

    if (!WatchListUserID || !WatchListContentID) {
        res.status(400).json({ message: 'WatchListUserID and WatchListContentID are required' });
        return;
    }

    try {
        const watchlist = await WatchList.findOne({
            where: { WatchListUserID: Number(WatchListUserID), WatchListContentID: Number(WatchListContentID) },
        });

        if (!watchlist) {
          res.status(200).json({});
            return;
        }

        res.status(200).json(watchlist);
    } catch (error) {
        console.error('Ошибка проверки желаемого:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};

export const findUserWatchLists = async (req: Request, res: Response): Promise<void> => {
  const { WatchListUserID } = req.query;

  if (!WatchListUserID) {
      res.status(400).json({ message: 'WatchListUserID are required' });
      return;
  }

  try {
      const watchlist = await WatchList.findAll({
          where: { WatchListUserID: Number(WatchListUserID)},
      });

      if (watchlist.length === 0) {
        res.status(200).json([]);
        return;
    }

      res.status(200).json(watchlist);
  } catch (error) {
      console.error('Ошибка проверки просмотров:', error);
      res.status(500).json({ message: 'Ошибка сервера', error });
  }
};


export const handleWatchListContent = async (req: Request, res: Response): Promise<void> => {
  const { WatchListUserID, WatchListContentID } = req.body;

  if (!WatchListUserID || !WatchListContentID) {
      res.status(400).json({ message: 'ViewUserID and ViewContentID are required' });
      return;
  }

  try {
      
      const existingWatchList = await WatchList.findOne({
          where: { WatchListUserID, WatchListContentID },
      });

      if (existingWatchList) {

          await existingWatchList.destroy();
          res.status(200).json({ message: 'просмотр удалён' });
      } else {
          const newWatchList = await WatchList.create({ WatchListUserID, WatchListContentID});
          res.status(201).json(newWatchList);
      }
  } catch (error) {
      console.error('Ошибка при обработке просмотра:', error);
      res.status(500).json({ message: 'Ошибка сервера', error });
  }
};
