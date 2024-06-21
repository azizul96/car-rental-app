import express from 'express';
import {
  getAllBookings,
  bookCar,
  getMyBookings,
  returnCar,
} from '../controllers/booking';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAllBookings);
router.post('/', auth, bookCar);
router.get('/my-bookings', auth, getMyBookings);
router.put('/return', auth, returnCar);

export default router;
