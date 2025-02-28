// routes/authRoutes.ts
import { Router } from 'express';
import { loginUser, getUserRoleController, getUserNameController, getUserIdController, refreshAccessToken, logoutUser } from '../controllers/authController';
import { getUserStatusController } from '../controllers/userController';
import jwt from 'jsonwebtoken';
import User from '../models/User';


const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const router = Router();

router.post('/login', loginUser);

router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

router.get('/user-role', getUserRoleController);
router.get('/user-name', getUserNameController);
router.get('/user-id', getUserIdController);
router.get('/user-status', getUserStatusController);
  

export default router;
