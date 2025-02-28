import Review from '../models/Review';
import User from '../models/User';


class ReviewService {
  async isReviewOwner(reviewId: number, userId: number) {
    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');
    return review.ReviewUserID === userId; // Проверяем, совпадает ли ID пользователя
  }

  async getReviewsByContent(contentId: number, isAdmin: boolean) {
    try {
      const whereClause = isAdmin
        ? { ReviewContentID: contentId } // Все отзывы для администратора
        : { ReviewContentID: contentId, ReviewStatus: 'available' }; // Только доступные для пользователей

      return await Review.findAll({ where: whereClause });
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      throw error;
    }
  }

  // Создать новый отзыв
  async createReview(userId: number, contentId: number, text: string, rating: number | null) {
    return await Review.create({
      ReviewUserID: userId,
      ReviewContentID: contentId,
      ReviewText: text,
      ReviewRating: rating,
      ReviewDate: new Date(),
      ReviewStatus: 'available',
    });
  }

  // Обновить отзыв (текст или статус)
  async updateReview(reviewId: number, userId: number, text?: string, status?: string, rating?: number | null) {
    const isOwner = await this.isReviewOwner(reviewId, userId);
    if (!isOwner) throw new Error('Доступ запрещён');

    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');

    if (text) review.ReviewText = text;
    if (status) review.ReviewStatus = status;
    if (rating !== undefined) review.ReviewRating = rating; // Обновляем рейтинг

    await review.save();
    return review;
  }

  // Обновить статус отзыва
async updateReviewStatus(reviewId: number, status: string): Promise<Review> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error('Отзыв не найден');
  }

  review.ReviewStatus = status;
  await review.save();

  return review;
}


  // Удалить отзыв
  async deleteReview(reviewId: number, userId: number) {
    const isOwner = await this.isReviewOwner(reviewId, userId);
    
    if (!isOwner) throw new Error('Доступ запрещён');

    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');

    await review.destroy();
  }

  // Получить отзывы с деталями пользователя
  async getUserNameByReviewId(reviewId: number): Promise<string | null> {
    const review = await Review.findOne({
      where: { ReviewID: reviewId },
      include: [
        {
          model: User,
          as: 'User', // Указываем alias, если использовали его в `belongsTo`
          attributes: ['UserName'],
        },
      ],
    });
  
    return review?.User?.UserName || null;
  }
  
  async blockReview(id: number): Promise<Review | null> {
    try {
      const review = await Review.findByPk(id);
  
      if (!review) {
        return null; // Отзыв не найден
      }
  
      review.ReviewStatus = 'blocked';
      await review.save();
      return review;
    } catch (error) {
      console.error('Ошибка блокировки отзыва:', error);
      throw error;
    }
  }
  
  async deleteReviewAdmin(id: number): Promise<boolean> {
    try {
      const review = await Review.findByPk(id);
  
      if (!review) {
        return false; // Отзыв не найден
      }
  
      await review.destroy();
      return true; // Отзыв удален
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      throw error;
    }
  }
  
}

export default new ReviewService();
