import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { required } = schema;
    if (required && Array.isArray(required)) {
      for (const field of required) {
        if (req.body[field] === undefined) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
    }
    next();
  };
};
