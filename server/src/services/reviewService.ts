import Review from '../models/Review';
import User from '../models/User';


class ReviewService {
  async isReviewOwner(reviewId: number, userId: number) {
    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');
    return review.ReviewUserID === userId;
  }

  async getReviewsByContent(contentId: number, isAdmin: boolean) {
    try {
      const whereClause = isAdmin
        ? { ReviewContentID: contentId } 
        : { ReviewContentID: contentId, ReviewStatus: 'available' }; 

      return await Review.findAll({ where: whereClause });
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      throw error;
    }
  }

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

  async updateReview(reviewId: number, userId: number, text?: string, status?: string, rating?: number | null) {
    const isOwner = await this.isReviewOwner(reviewId, userId);
    if (!isOwner) throw new Error('Доступ запрещён');

    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');

    if (text) review.ReviewText = text;
    if (status) review.ReviewStatus = status;
    if (rating !== undefined) review.ReviewRating = rating;

    await review.save();
    return review;
  }

async updateReviewStatus(reviewId: number, status: string): Promise<Review> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error('Отзыв не найден');
  }

  review.ReviewStatus = status;
  await review.save();

  return review;
}


  async deleteReview(reviewId: number, userId: number) {
    const isOwner = await this.isReviewOwner(reviewId, userId);
    
    if (!isOwner) throw new Error('Доступ запрещён');

    const review = await Review.findByPk(reviewId);
    if (!review) throw new Error('Отзыв не найден');

    await review.destroy();
  }

  async getUserNameByReviewId(reviewId: number): Promise<string | null> {
    const review = await Review.findOne({
      where: { ReviewID: reviewId },
      include: [
        {
          model: User,
          as: 'User',
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
        return null;
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
        return false;
      }
  
      await review.destroy();
      return true;
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      throw error;
    }
  }
  
}

export default new ReviewService();
