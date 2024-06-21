import express from 'express';
import {
  bookCar,
  getAllBookings,
  getMyBookings,
  returnCar,
} from '../controllers/booking';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, authorize(['admin']), bookCar);
router.get('/', auth, getAllBookings);
router.get('/mybookings', auth, getMyBookings);
router.put('/return', auth, returnCar);

export default router;
