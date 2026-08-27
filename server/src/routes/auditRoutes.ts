import { Router } from 'express';
import { logDuration, logEvent, getAuditLogs } from '../controllers/auditController';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Track active duration on an application
router.post('/duration', authenticateToken, logDuration);

// Track a generic event like DOC_VIEW
router.post('/event', authenticateToken, logEvent);

// Admin route to get all audit logs
router.get('/', authenticateToken, requireRole(['admin', 'staff']), getAuditLogs);

export default router;
