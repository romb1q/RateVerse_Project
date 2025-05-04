import {Router} from 'express';
import { getCollections } from '../controllers/collectionController';

const router = Router();

router.get('/collections', getCollections);

export default router;
