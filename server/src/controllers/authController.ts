// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService';
import { getUserRole, getUserName, getUserId } from '../services/authService';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

console.log('JWT_SECRET:', JWT_SECRET);

export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { UserName, UserPassword } = req.body;

        if (!UserName || !UserPassword) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const user = await userService.findUserByName(UserName);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(UserPassword, user.UserPassword);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign({ userId: user.UserID }, JWT_SECRET, { expiresIn: '2h' });
        const refreshToken = jwt.sign({ userId: user.UserID }, REFRESH_SECRET, { expiresIn: '3d' });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict' });
        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
}

export async function refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        console.log("Отсутствует refreshToken в cookie");
        res.status(401).json({ error: 'Refresh token not provided' });
        return;
    }

    if (!REFRESH_SECRET || !JWT_SECRET) {
        console.error("Ошибка: Переменные окружения REFRESH_SECRET или JWT_SECRET не определены.");
        process.exit(1);
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as jwt.JwtPayload;
        console.log("Декодированный refreshToken: ", decoded);
        const userId = decoded.userId;

        const newAccessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
}
export const getUserRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'] as string;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(200).json({ role: 'guest' });
      return;
    }

    try {
      const role = await getUserRole(token);
      res.status(200).json({ role });
    } catch (error) {
      console.error('Ошибка проверки токена:', error);
      res.status(401).json({ message: 'Неверный токен' });
    }
  } catch (error: unknown) {
    console.error('Ошибка при получении роли пользователя:', (error as Error).message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};


export const getUserNameController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(200).json({ name: 'Guest' });
      return;
    }

    const name = await getUserName(token);
    res.status(200).json({ name });
  } catch (error: unknown) {
    console.error('Ошибка при получении имени пользователя:', (error as Error).message);
    res.status(401).json({ message: (error as Error).message });
  }
};

export const getUserIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(200).json({ id: 0 });
      return;
    }

    const id = await getUserId(token);
    res.status(200).json({ id });
  } catch (error: unknown) {
    console.error('Ошибка при получении ID пользователя:', (error as Error).message);
    res.status(401).json({ message: (error as Error).message });
  }
};

export function logoutUser(req: Request, res: Response): void {
    try {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
      });
    res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Failed to logout' });
      }
}

