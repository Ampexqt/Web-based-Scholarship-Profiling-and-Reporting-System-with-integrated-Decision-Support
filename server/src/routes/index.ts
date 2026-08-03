import express from 'express';
const router = express.Router();
import { checkHealth } from '../controllers/healthController';
import applicationRoutes from './applicationRoutes';
import locationRoutes from './locationRoutes';

// Health check route
router.get('/health', checkHealth);

// Application routes
router.use('/applications', applicationRoutes);

// Location routes
router.use('/locations', locationRoutes);

export default router;
