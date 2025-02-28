import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { getUserStatus } from '../services/authService'
import bcrypt from 'bcryptjs';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Создание пользователя
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function checkUserName(req: Request, res: Response): Promise<void> {
  try {
    const { UserName } = req.body;
    const user = await User.findOne({ where: { UserName } });

    if (user) {
      res.status(200).json({ isAvailable: false });
    } else {
      res.status(200).json({ isAvailable: true });
    }
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Ошибка проверки имени пользователя.' });
  }
}

// Получение пользователя по ID
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

// Получение всех пользователей
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

// Обновление пользователя
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const affectedCount = await userService.updateUser(Number(req.params.id), req.body);
    if (affectedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// Удаление пользователя
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const affectedCount = await userService.deleteUser(Number(req.params.id));
    if (affectedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { UserName, UserPassword } = req.body;

    // Проверка на наличие необходимых данных
    if (!UserName || !UserPassword) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(UserPassword, salt);

    // Регистрируем пользователя
    const newUser = await userService.registerUser({ UserName, UserPassword: hashedPassword, UserRole: 'user', UserStatus: 'active' });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

export const getUserStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Токен не предоставлен' });
      return;
    }

    const status = await getUserStatus(token);
    res.status(200).json({ status });
  } catch (error: unknown) {
    console.error('Ошибка при получении статуса пользователя:', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};





