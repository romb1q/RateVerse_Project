import { Router } from 'express';
import { getUserStats } from '../controllers/userStatController';

const router = Router();

router.get('/user/:id/stats', getUserStats);

export default router;
