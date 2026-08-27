import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getStaff,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  resetStaffPassword
} from '../controllers/staffController';

const router = Router();

router.use(authenticateToken);

router.get('/', getStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.put('/:id/status', toggleStaffStatus);
router.put('/:id/reset-password', resetStaffPassword);

export default router;
