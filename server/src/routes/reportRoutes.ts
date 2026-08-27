import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { exportTesAnnex1 } from '../controllers/reportController';

const router = express.Router();

router.use(authenticateToken);

router.get('/tes-annex1', exportTesAnnex1);

export default router;
