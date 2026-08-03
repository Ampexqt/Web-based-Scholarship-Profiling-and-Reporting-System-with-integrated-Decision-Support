import db from '../config/db';

import { Request, Response, NextFunction } from 'express';

export const checkHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simple DB query to verify connection using Prisma
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Server and Prisma Database connection are healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

