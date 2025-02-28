// src/services/authService.ts
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const getUserRole = async (token: string): Promise<string> => { 
  console.log('ТОКЕН: ', token); // Указываем тип token
    if (!token) throw new Error('Токен не предоставлен');
  
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;  // Явное приведение к типу jwt.JwtPayload
    const userId = decoded.userId;
  
    if (!userId) throw new Error('Недействительный токен');
  
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
  
    console.log("role", user.UserRole);
    return user.UserRole;
  };
  export const getUserName = async (token: string): Promise<string> => {  // Указываем тип token
    if (!token) throw new Error('Токен не предоставлен');
  
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;  // Явное приведение к типу jwt.JwtPayload
    const userId = decoded.userId;
  
    if (!userId) throw new Error('Недействительный токен');
  
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
  
    return user.UserName;
  };

  export const getUserId = async (token:string): Promise<string> => {
    if (!token) throw new Error('Токен не предоставлен');

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.userId;
    if (!userId) throw new Error('Недействительный токен');
    return userId;
  }
  export const getUserStatus = async (token: string): Promise<string> => {
    if (!token) throw new Error('Токен не предоставлен');
  
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // Расшифровка токена
    const userId = decoded.userId;
  
    if (!userId) throw new Error('Недействительный токен');
  
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Пользователь не найден');
  
    return user.UserStatus; // Возвращаем статус пользователя
  };
  
