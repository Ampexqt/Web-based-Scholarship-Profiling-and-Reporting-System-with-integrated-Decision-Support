import express from 'express';
import { submitApplication, getApplications, getDashboardStats, getApplicationById, updateApplicationStatus, verifyDocument } from '../controllers/applicationController';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

// Staff and Admin routes
router.get('/stats', authenticateToken, requireRole(['admin', 'staff']), getDashboardStats);
router.get('/', authenticateToken, requireRole(['admin', 'staff']), getApplications);
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'staff']), updateApplicationStatus);
router.patch('/:id/verify-document', authenticateToken, requireRole(['admin', 'staff']), verifyDocument);

// Public submission and application status check (declared after static routes to avoid param collision)
router.post('/', upload.any(), submitApplication);
router.get('/:id', getApplicationById);

export default router;
