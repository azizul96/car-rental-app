import { Request, Response } from 'express';
import Car from '../models/Car';
import { z } from 'zod';

const createCar = async (req: Request, res: Response) => {
  const carSchema = z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
    isElectric: z.boolean(),
    features: z.array(z.string()),
    pricePerHour: z.number().positive(),
  });

  try {
    const validatedData = carSchema.parse(req.body);
    const car = new Car(validatedData);
    await car.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Car created successfully',
      data: car,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errorMessages: error.errors,
      });
    } else {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find({ isDeleted: false });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Cars retrieved successfully',
      data: cars,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);
    if (!car || car.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Car retrieved successfully',
      data: car,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateCar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const carSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    isElectric: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number().positive().optional(),
    status: z.enum(['available', 'unavailable']).optional(),
  });

  try {
    const validatedData = carSchema.parse(req.body);
    const car = await Car.findByIdAndUpdate(id, validatedData, { new: true });

    if (!car || car.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Car updated successfully',
      data: car,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errorMessages: error.errors,
      });
    } else {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const car = await Car.findByIdAndDelete(id, { isDeleted: true });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: 'Car deleted successfully',
      data: car,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export { createCar, getAllCars, getCar, updateCar, deleteCar };
