import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import { authenticateAdmin } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.get('/me', authenticateAdmin, getMe);
router.post('/logout', logout);

export default router;
