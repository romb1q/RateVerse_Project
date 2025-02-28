import { Router } from 'express';
import { createView, removeView, findView, findUserViews } from '../controllers/viewController';

const router = Router();


router.post('/view', createView);


router.delete('/view', removeView);


router.get('/view', findView);

router.get('/views', findUserViews);

export default router;
