import { Request, Response } from 'express';
import * as contentService from '../services/contentStats';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const contentId = parseInt(req.params.id, 10);
  if (isNaN(contentId)) {
    res.status(400).json({ error: 'Invalid content ID' });
    return;
  }

  try {
    const stats = await contentService.getContentStats(contentId);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
