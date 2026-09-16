import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Route files
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';

// Jobs
import { startSlotExpiryJob } from './jobs/slotExpiry';

const app = express();

// Security and CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, postman) or matching any frontend
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadPath = path.join(process.cwd(), config.UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(uploadPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', publicRoutes);

// In production, serve frontend client build if present
const clientDistPath = path.join(process.cwd(), '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

// Start Jobs
startSlotExpiryJob();

// Start Server
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
