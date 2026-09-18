import { Router } from 'express';
import multer from 'multer';
import {
  uploadOfficialRecords,
  getUploadHistory,
  getFlaggedApplications
} from '../controllers/decisionSupport.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadOfficialRecords);
router.get('/history', getUploadHistory);
router.get('/flags', getFlaggedApplications);

export default router;
