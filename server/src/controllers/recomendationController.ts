import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import recommendationService from '../services/recommendationService';

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'jwt_secret');
    const userId = (decoded as any).userId;
    

    const data = await recommendationService.getRecommendationsByUser(userId);
    res.json(data);
  } catch (error) {
    console.error('Error verifying token or fetching recommendations:', error);
    res.status(403).json({ error: 'Invalid token or failed to fetch recommendations' });
  }
};
