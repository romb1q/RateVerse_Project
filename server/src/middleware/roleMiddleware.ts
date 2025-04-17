import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

console.log('JWT_SECRET:', JWT_SECRET);

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.split(' ')[1] : undefined;

      if (!token) {
        if (roles.includes('guest')) {
          return next();
        }
        res.status(403).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log('Decoded payload:', decoded);

      const userId = decoded.userId;

      if (!userId) {
        res.status(401).json({ message: 'Недействительный токен.' });
        return;
      }

      const user = await User.findByPk(userId);

      if (!user || !roles.includes(user.UserRole)) {
        res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
        return;
      }

      console.log('Token:', token);
      console.log('Decoded token ID:', decoded.userId);

      (req as any).user = user;
      next();
    } catch (error) {
      const err = error as Error; // Приведение к типу `Error`
      console.error('JWT verification error:', err.message);

      if (roles.includes('guest')) {
        return next();
      }

      res.status(401).json({ message: 'Недействительный токен.' });
    }
  };
};
