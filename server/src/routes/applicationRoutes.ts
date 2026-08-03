import express from 'express';
import { submitApplication } from '../controllers/applicationController';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Allow any file uploads for now to handle all 15 different file inputs
router.post('/', upload.any(), submitApplication);

export default router;
