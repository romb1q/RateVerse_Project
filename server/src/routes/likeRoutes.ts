import { Router } from 'express';
import LikeController from '../controllers/likeController';

const router = Router();

// POST /api/likes - Добавить лайк
router.post('/like', LikeController.createLike);

// DELETE /api/likes - Удалить лайк
router.delete('/like', LikeController.removeLike);

// GET /api/likes/check - Проверить лайк
router.get('/like', LikeController.findLike);

router.get('/likes', LikeController.findUserLikes);

export default router;
