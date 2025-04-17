import express from 'express';
import { getRecommendations } from '../controllers/recomendationController';
//import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/recomendations', getRecommendations);

export default router;
