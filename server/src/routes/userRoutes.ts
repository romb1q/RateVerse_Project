import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';

const router = Router();

// Роуты для пользователей
router.post('/users', userController.createUser);
// Маршруты, доступные только администратору
router.get('/users/:id', authMiddleware, checkRole(['admin']), userController.getUser);
router.get('/users', authMiddleware, checkRole(['admin']), userController.getAllUsers);
router.put('/users/:id', authMiddleware, checkRole(['admin']), userController.updateUser);
router.delete('/users/:id', authMiddleware, checkRole(['admin']), userController.deleteUser);
router.get('/users/status', authMiddleware, userController.getUserStatusController);
router.post('/register', userController.registerUser);
router.post('/users/check-username', userController.checkUserName);


export default router;
