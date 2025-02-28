import { Request, Response } from 'express';
import View from '../models/View';


export const createView = async (req: Request, res: Response): Promise<void> => {
    const { ViewUserID, ViewContentID } = req.body;

    if (!ViewUserID || !ViewContentID) {
        res.status(400).json({ message: 'ViewUserID and ViewContentID are required' });
        return;
    }

    try {
        
        const existingView = await View.findOne({
            where: { ViewUserID, ViewContentID },
        });

        if (existingView) {
        
          await existingView.destroy();
          res.status(200).json({ message: 'просмотр удалён' });
      } else {
        
          const newView = await View.create({ ViewUserID, ViewContentID, ViewDate: new Date() });
          res.status(201).json(newView);
      }
    } catch (error) {
        console.error('Ошибка создания просмотра:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};


export const removeView = async (req: Request, res: Response): Promise<void> => {
    const { ViewUserID, ViewContentID } = req.body;

    if (!ViewUserID || !ViewContentID) {
        res.status(400).json({ message: 'ViewUserID and ViewContentID are required' });
        return;
    }

    try {
        const view = await View.findOne({
            where: { ViewUserID, ViewContentID },
        });

        if (!view) {
            res.status(404).json({ message: 'просмотр не найден' });
            return;
        }

        await view.destroy();
        res.status(200).json({ message: 'просмотр удалён' });
    } catch (error) {
        console.error('Ошибка удаления просмотра:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};


export const findView = async (req: Request, res: Response): Promise<void> => {
    const { ViewUserID, ViewContentID } = req.query;

    if (!ViewUserID || !ViewContentID) {
        res.status(400).json({ message: 'ViewUserID and ViewContentID are required' });
        return;
    }

    try {
        const view = await View.findOne({
            where: { ViewUserID: Number(ViewUserID), ViewContentID: Number(ViewContentID) },
        });

        if (!view) {
          res.status(200).json({});
            return;
        }

        res.status(200).json(view);
    } catch (error) {
        console.error('Ошибка проверки просмотра:', error);
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
};

export const findUserViews = async (req: Request, res: Response): Promise<void> => {
  const { ViewUserID } = req.body;

  if (!ViewUserID) {
      res.status(400).json({ message: 'ViewUserID are required' });
      return;
  }

  try {
      const view = await View.findAll({
          where: { ViewUserID: Number(ViewUserID)},
      });

      if (view.length === 0) {
        res.status(200).json([]);
        return;
    }

      res.status(200).json(view);
  } catch (error) {
      console.error('Ошибка проверки просмотров:', error);
      res.status(500).json({ message: 'Ошибка сервера', error });
  }
};


export const handleViewContent = async (req: Request, res: Response): Promise<void> => {
  const { ViewUserID, ViewContentID } = req.body;

  if (!ViewUserID || !ViewContentID) {
      res.status(400).json({ message: 'ViewUserID and ViewContentID are required' });
      return;
  }

  try {
      
      const existingView = await View.findOne({
          where: { ViewUserID, ViewContentID },
      });

      if (existingView) {

          await existingView.destroy();
          res.status(200).json({ message: 'просмотр удалён' });
      } else {
          const newView = await View.create({ ViewUserID, ViewContentID, ViewDate: new Date() });
          res.status(201).json(newView);
      }
  } catch (error) {
      console.error('Ошибка при обработке просмотра:', error);
      res.status(500).json({ message: 'Ошибка сервера', error });
  }
};
