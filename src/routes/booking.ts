import express from 'express';
import { bookCar, getAllBookings, getMyBookings } from '../controllers/booking';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, bookCar);
router.get('/', auth, authorize(['admin']), getAllBookings);
router.get('/my-bookings', auth, getMyBookings);

export default router;
