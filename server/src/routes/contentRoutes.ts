import express from 'express';
import multer from 'multer';
import { upload } from '../middleware/uploadMiddleware';
import {
  getAllContentsController,
  createContentController,
  deleteContentController,
  updateContentController,
  getContentByIdController
} from '../controllers/contentController';

const router = express.Router();

router.get('/contents', getAllContentsController);
router.get('/contents/:id', getContentByIdController);

router.post('/contents', upload.single('ContentImage'), createContentController);

router.delete('/contents/:id', deleteContentController);
router.put('/contents/:id/', upload.single('ContentImage'), updateContentController);

export default router;
