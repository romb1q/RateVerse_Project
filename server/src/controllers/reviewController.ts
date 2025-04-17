import { Request, Response } from 'express';
import ReviewService from '../services/reviewService';
import jwt from 'jsonwebtoken';
import { log } from 'console';

// interface AuthenticatedRequest extends Request {
//   user?: {
//     UserID: number;
//     UserRole: string;
//   };
// }

class ReviewController {
  async getReviewsByContent(req: Request, res: Response): Promise<void> {
    try {
      const contentId = parseInt(req.params.contentId, 10);

      const isAdmin = req.user?.UserRole === 'admin';

      const reviews = await ReviewService.getReviewsByContent(contentId, isAdmin);

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const { userId, contentId, text, rating } = req.body;
      const review = await ReviewService.createReview(userId, contentId, text, rating);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании отзыва' });
    }
  }

  async updateReview(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
     return;
    }

  const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, "jwt_secret");
    const userId = (decoded as any).userId;
    try {
      const { reviewId } = req.params;
      const { text, status, rating } = req.body;
      const updatedReview = await ReviewService.updateReview(Number(reviewId), userId, text, status, rating);
      res.status(200).json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении отзыва' });
    }
  }

  async deleteReview(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
     return;
    }

  const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, "jwt_secret");
    const userId = (decoded as any).userId;
    try {
      const { reviewId } = req.params;
      
      await ReviewService.deleteReview(Number(reviewId), userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении отзыва' });
    }
  }

  async getUserNameByReviewId(req: Request, res: Response): Promise<void> {
    try {
      const reviewId = Number(req.params.reviewId);
      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Некорректный ID отзыва' });
        return;
      }

      const userName = await ReviewService.getUserNameByReviewId(reviewId);

      if (!userName) {
        res.status(404).json({ error: 'Пользователь не найден' });
        return;
      }

      res.status(200).json({ userName });
    } catch (error) {
      console.error('Ошибка при получении имени пользователя:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
  async blockReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
  
      if (req.user?.UserRole !== 'admin') {
        res.status(403).json({ error: 'Недостаточно прав' });
        return;
      }
  
      const updatedReview = await ReviewService.updateReviewStatus(Number(reviewId), 'blocked');
      res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Ошибка при блокировке отзыва:', error);
      res.status(500).json({ error: 'Ошибка при блокировке отзыва' });
    }
  }

  async unblockReviewById(req: Request, res: Response): Promise<void> {
  try {
    const { reviewId } = req.params;

    if (req.user?.UserRole !== 'admin') {
      res.status(403).json({ error: 'Недостаточно прав' });
      return;
    }

    const updatedReview = await ReviewService.updateReviewStatus(Number(reviewId), 'available');
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Ошибка при разблокировке отзыва:', error);
    res.status(500).json({ error: 'Ошибка при разблокировке отзыва' });
  }
}


  async deleteReviewById(req: Request, res: Response): Promise<void> {
    try {
      const reviewId = parseInt(req.params.reviewId, 10);
      const isDeleted = await ReviewService.deleteReviewAdmin(reviewId);
  
      if (!isDeleted) {
        res.status(404).json({ message: 'Отзыв не найден' });
        return; 
      }
      res.status(204).send();
      return; 
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
      return; 
    }
  }
}

export default new ReviewController();
