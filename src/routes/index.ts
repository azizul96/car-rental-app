import express from 'express';
import authRoutes from './auth';
import carRoutes from './car';
import bookingRoutes from './booking';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);

export default router;
