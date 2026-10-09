import { Router } from 'express';
import multer from 'multer';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import {
  uploadOfficialRecords,
  getUploadHistory,
  getFlaggedApplications
} from '../controllers/decisionSupport.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticateToken);
router.use(requireRole(['admin', 'staff']));

router.post('/upload', upload.single('file'), uploadOfficialRecords);
router.get('/history', getUploadHistory);
router.get('/flags', getFlaggedApplications);

export default router;
