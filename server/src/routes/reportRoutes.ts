import express from 'express';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware';
import { exportTesAnnex1, getAnnex1Summary } from '../controllers/reportController';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['admin', 'staff']));

router.get('/tes-annex1/summary', getAnnex1Summary);
router.get('/tes-annex1', exportTesAnnex1);

export default router;
