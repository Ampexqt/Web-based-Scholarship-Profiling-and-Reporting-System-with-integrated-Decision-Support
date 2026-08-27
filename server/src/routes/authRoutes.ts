import { Router } from 'express';
import { login, refresh, logout, getMe } from '../controllers/authController';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', loginRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

export default router;
