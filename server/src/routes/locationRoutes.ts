import express from 'express';
import { getRegions, getProvinces, getCities, getBarangays } from '../controllers/locationController';

const router = express.Router();

router.get('/regions', getRegions);
router.get('/provinces', getProvinces);
router.get('/cities', getCities);
router.get('/barangays', getBarangays);

export default router;
