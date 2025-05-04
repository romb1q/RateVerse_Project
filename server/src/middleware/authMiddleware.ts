import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  console.log('AuthMiddleware is worked');

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export async function checkIsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      res.status(401).json({ message: 'Токен не предоставлен' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    if (!userId) {
      res.status(401).json({ message: 'Недействительный токен' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user || user.UserRole !== 'admin') {
      res.status(403).json({ message: 'Доступ запрещен. Только для админов.' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    const err = error as Error;
    console.error('Ошибка проверки администратора:', err.message);
    res.status(401).json({ message: 'Ошибка авторизации' });
  }
}