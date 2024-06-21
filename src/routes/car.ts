import express from 'express';
import {
  createCar,
  getAllCars,
  getCar,
  updateCar,
  deleteCar,
} from '../controllers/car';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createCar);
router.get('/', getAllCars);
router.get('/:id', getCar);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, authorize(['admin']), deleteCar);

export default router;
