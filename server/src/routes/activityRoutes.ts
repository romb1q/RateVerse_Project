import {Router} from 'express';
import { getUserActivity } from '../controllers/activityController';

const router = Router();

router.get('/activity', getUserActivity);

export default router;
