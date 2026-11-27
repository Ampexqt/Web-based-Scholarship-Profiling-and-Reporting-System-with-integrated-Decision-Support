import { Router } from 'express';
import multer from 'multer';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import {
  uploadOfficialRecords,
  getUploadHistory,
  getFlaggedApplications
} from '../controllers/decisionSupport.controller';
import {
  getMcdaRankings,
  getMcdaWeights,
  updateMcdaWeights,
  recordMcdaDecision
} from '../controllers/mcda.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticateToken);
router.use(requireRole(['admin', 'staff']));

router.post('/upload', upload.single('file'), uploadOfficialRecords);
router.get('/history', getUploadHistory);
router.get('/flags', getFlaggedApplications);

// MCDA Decision Support Endpoints
router.get('/rankings', getMcdaRankings);
router.get('/weights', getMcdaWeights);
router.post('/weights', requireRole(['admin']), updateMcdaWeights);
router.post('/override', recordMcdaDecision);

export default router;
