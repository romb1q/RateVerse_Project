import {Router} from 'express';
import { getStats } from '../controllers/contentStatController';

const router = Router();

router.get('/content/:id/stats', getStats);


export default router;
