import { Router } from 'express';
import { createWatchList, removeWatchList, findWatchList, findUserWatchLists } from '../controllers/watchlistController';

const router = Router();


router.post('/watchlist', createWatchList);


router.delete('/watchlist', removeWatchList);


router.get('/watchlist', findWatchList);

router.get('/watchlists', findUserWatchLists);

export default router;
