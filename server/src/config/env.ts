import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/skylite',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPI_ID: process.env.UPI_ID || 'merchant@upi',
  UPI_PAYEE_NAME: process.env.UPI_PAYEE_NAME || 'SkyLite Private Theatre',
  UPI_CURRENCY: process.env.UPI_CURRENCY || 'INR',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '+910000000000',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads'
};
