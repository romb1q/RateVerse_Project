import express from 'express';
import {
    createOrUpdateRating,
    getUserRatingForContent,
    updateRating,
    getRatingsByContent,
    deleteRating,
} from '../controllers/ratingController';

const router = express.Router();

router.post('/', createOrUpdateRating); // Создание рейтинга
router.get('/:contentId', getRatingsByContent); // Получение рейтингов по contentId
router.get('/user/:userId/content/:contentId', getUserRatingForContent); // Получение рейтинга конкретного пользователя
router.put('/:ratingId', updateRating); // Обновление рейтинга
router.delete('/:ratingId', deleteRating); // Удаление рейтинга

export default router;
