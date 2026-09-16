import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (config.NODE_ENV === 'development') {
    console.error('[API Error]:', err);
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'A record with this value already exists.' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Record not found.' });
    }
  }

  const statusCode = err.statusCode || (err.message?.includes('not found') ? 404 : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ success: false, error: message });
};
