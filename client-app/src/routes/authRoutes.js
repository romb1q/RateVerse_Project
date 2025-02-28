// // src/routes/authRoutes.js
// import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// const router = Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// // Маршрут для получения роли пользователя
// router.get('/user-role', async (req, res) => {
//   try {
//     // Извлекаем токен из заголовков
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Токен не предоставлен' });
//     }

//     // Декодируем токен
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.userId;

//     // Находим пользователя по ID
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Пользователь не найден' });
//     }

//     // Возвращаем роль пользователя
//     res.json({ role: user.UserRole });
//   } catch (error) {
//     res.status(401).json({ message: 'Недействительный токен' });
//   }
// });

// export default router;
