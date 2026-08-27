import express from 'express';
const router = express.Router();
import { checkHealth } from '../controllers/healthController';
import applicationRoutes from './applicationRoutes';
import locationRoutes from './locationRoutes';

import authRoutes from './authRoutes';
import auditRoutes from './auditRoutes';
import reportRoutes from './reportRoutes';
import staffRoutes from './staffRoutes';

// Health check route
router.get('/health', checkHealth);

// Auth routes
router.use('/auth', authRoutes);

// Application routes
router.use('/applications', applicationRoutes);

// Location routes
router.use('/locations', locationRoutes);

// Audit routes
router.use('/audit', auditRoutes);

// Report routes
router.use('/reports', reportRoutes);

// Staff routes
router.use('/staff', staffRoutes);

export default router;
