import express from 'express';
import { submitApplication, getApplications, getDashboardStats, getApplicationById, updateApplicationStatus, verifyDocument } from '../controllers/applicationController';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

import { authenticateToken } from '../middlewares/authMiddleware';

router.get('/', getApplications);
router.get('/stats', getDashboardStats);
router.get('/:id', getApplicationById);
router.patch('/:id/status', authenticateToken, updateApplicationStatus);
router.patch('/:id/verify-document', authenticateToken, verifyDocument);

// Allow any file uploads for now to handle all 15 different file inputs
router.post('/', upload.any(), submitApplication);

export default router;
