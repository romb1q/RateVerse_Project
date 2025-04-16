import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { fetchUserActivity } from '../services/activityService';

export const getUserActivity = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'jwt_secret');
    const userId = (decoded as any).userId;

    const activity = await fetchUserActivity(userId);
    res.json(activity);
  } catch (error) {
    console.error('Error verifying token or fetching activity:', error);
    res.status(403).json({ error: 'Invalid token or failed to fetch activity' });
  }
};
