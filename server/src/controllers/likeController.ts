import { Request, Response } from 'express';
import Like from '../models/Like';

class LikeController {
    async createLike(req: Request, res: Response): Promise<void> {
        const { LikeUserID, LikeContentID } = req.body;
    
        if (!LikeUserID || !LikeContentID) {
            res.status(400).json({ message: 'LikeUserID and LikeContentID are required' });
            return;
        }
    
        try {
            const existingLike = await Like.findOne({
                where: { LikeUserID, LikeContentID },
            });
    
            if (existingLike) {
              await existingLike.destroy();
              res.status(200).json({ message: 'Лайк удалён' });
          } else {
              const newLike = await Like.create({ LikeUserID, LikeContentID, LikeDate: new Date() });
              res.status(201).json(newLike);
          }
        } catch (error) {
            console.error('Ошибка создания лайка:', error);
            res.status(500).json({ message: 'Ошибка сервера', error });
        }
    };

    async removeLike(req: Request, res: Response): Promise<void> {
        const { LikeUserID, LikeContentID } = req.body;
    
        if (!LikeUserID || !LikeContentID) {
            res.status(400).json({ message: 'LikeUserID and LikeContentID are required' });
            return;
        }
    
        try {
            const like = await Like.findOne({
                where: { LikeUserID, LikeContentID },
            });
    
            if (!like) {
                res.status(404).json({ message: 'Лайк не найден' });
                return;
            }
    
            await like.destroy();
            res.status(200).json({ message: 'Лайк удалён' });
        } catch (error) {
            console.error('Ошибка удаления лайка:', error);
            res.status(500).json({ message: 'Ошибка сервера', error });
        }
    };

    async findLike(req: Request, res: Response): Promise<void> {
        const { LikeUserID, LikeContentID } = req.query;
    
        if (!LikeUserID || !LikeContentID) {
            res.status(400).json({ message: 'LikeUserID and LikeContentID are required' });
            return;
        }
    
        try {
            const like = await Like.findOne({
                where: { LikeUserID: Number(LikeUserID), LikeContentID: Number(LikeContentID) },
            });
    
            if (!like) {
              res.status(200).json({});
                return;
            }
    
            res.status(200).json(like);
        } catch (error) {
            console.error('Ошибка проверки лайка:', error);
            res.status(500).json({ message: 'Ошибка сервера', error });
        }
    };

    async findUserLikes(req: Request, res: Response): Promise<void> {
        const { LikeUserID } = req.query;
      
        if (!LikeUserID) {
            res.status(400).json({ message: 'LikeUserID are required' });
            return;
        }
      
        try {
            const like = await Like.findAll({
                where: { LikeUserID: Number(LikeUserID)},
            });
      
            if (like.length === 0) {
              res.status(200).json([]);
              return;
          }
      
            res.status(200).json(like);
        } catch (error) {
            console.error('Ошибка проверки лайков:', error);
            res.status(500).json({ message: 'Ошибка сервера', error });
        }
      };

      async handleLikeContent(req: Request, res: Response): Promise<void> {
        const { LikeUserID, LikeContentID } = req.body;
      
        if (!LikeUserID || !LikeContentID) {
            res.status(400).json({ message: 'LikeUserID and LikeContentID are required' });
            return;
        }
      
        try {
            const existingLike = await Like.findOne({
                where: { LikeUserID, LikeContentID },
            });
      
            if (existingLike) {
                await existingLike.destroy();
                res.status(200).json({ message: 'Лайк удалён' });
            } else {
                const newLike = await Like.create({ LikeUserID, LikeContentID, LikeDate: new Date() });
                res.status(201).json(newLike);
            }
        } catch (error) {
            console.error('Ошибка при обработке лайка:', error);
            res.status(500).json({ message: 'Ошибка сервера', error });
        }
      };
}
export default new LikeController();
