import express from 'express';
import {
    createOrUpdateRating,
    getUserRatingForContent,
    updateRating,
    getRatingsByContent,
    deleteRating,
} from '../controllers/ratingController';

const router = express.Router();

router.post('/', createOrUpdateRating);
router.get('/:contentId', getRatingsByContent);
router.get('/user/:userId/content/:contentId', getUserRatingForContent);
router.put('/:ratingId', updateRating);
router.delete('/:ratingId', deleteRating);

export default router;
