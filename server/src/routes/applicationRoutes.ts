import express from 'express';
import { submitApplication, getApplications, getDashboardStats, getApplicationById, updateApplicationStatus, verifyDocument } from '../controllers/applicationController';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

// Public submission and application status check
router.post('/', upload.any(), submitApplication);
router.get('/:id', getApplicationById);

// Staff and Admin routes
router.get('/', authenticateToken, requireRole(['admin', 'staff']), getApplications);
router.get('/stats', authenticateToken, requireRole(['admin', 'staff']), getDashboardStats);
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'staff']), updateApplicationStatus);
router.patch('/:id/verify-document', authenticateToken, requireRole(['admin', 'staff']), verifyDocument);

export default router;
