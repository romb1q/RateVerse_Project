import express from 'express';
import ReviewController from '../controllers/reviewController';
import { checkRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/review/content/:contentId', checkRole(['user', 'guest', 'admin']), ReviewController.getReviewsByContent);

router.post('/review/', ReviewController.createReview);

router.put('/review/:reviewId', ReviewController.updateReview);

router.delete('/review/:reviewId', ReviewController.deleteReview);

router.delete('/review/admin/:reviewId', ReviewController.deleteReviewById);

router.patch('/review/:reviewId/status/block', checkRole(['admin']), ReviewController.blockReviewById);

router.patch('/review/:reviewId/status/unblock', checkRole(['admin']), ReviewController.unblockReviewById);

router.get('/review/:reviewId/user', ReviewController.getUserNameByReviewId);

export default router;
