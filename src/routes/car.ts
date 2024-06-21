import express from 'express';
import {
  createCar,
  getAllCars,
  getCar,
  updateCar,
  deleteCar,
  returnCar,
} from '../controllers/car';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, authorize(['admin']), createCar);
router.get('/', getAllCars);
router.get('/:id', getCar);
router.put('/:id', auth, authorize(['admin']), updateCar);
router.put('/return', auth, authorize(['admin']), returnCar);
router.delete('/:id', auth, authorize(['admin']), deleteCar);

export default router;
