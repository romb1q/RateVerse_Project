import { Request, Response } from 'express';
import  Like  from '../models/Like';
import  View  from '../models/View';
import  Watchlist  from '../models/Watchlist';
import { Op } from 'sequelize';
import Content from '../models/Content';

export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  if (!userId) res.status(400).json({ error: 'Invalid user ID' });

  try {
    const [likesCount, watchedCount, watchlistCount, likedByType] = await Promise.all([
      Like.count({ where: { LikeUserID: userId } }),
      View.count({ where: { ViewUserID: userId } }),
      Watchlist.count({ where: { WatchListUserID: userId } }),
      Like.findAll({
        where: { LikeUserID: userId },
        include: [{ model: Content,as: 'Content', attributes: ['ContentType'] }],
      }),
    ]);

    const typeStats: Record<string, number> = {};
    likedByType.forEach((like: any) => {
      const type = like.Content?.ContentType || 'Другое';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    res.json({
      likes: likesCount,
      watched: watchedCount,
      watchlist: watchlistCount,
      likesByType: typeStats,
    });
  } catch (err) {
    console.error('Ошибка при получении статистики пользователя:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
  return;
};
