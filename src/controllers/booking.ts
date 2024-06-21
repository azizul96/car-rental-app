import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Car from '../models/Car';
import { z } from 'zod';

const bookCar = async (req: Request, res: Response) => {
  const bookingSchema = z.object({
    carId: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string().optional(),
  });

  try {
    const validatedData = bookingSchema.parse(req.body);
    const car = await Car.findById(validatedData.carId);

    if (!car || car.isDeleted || car.status === 'unavailable') {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking',
      });
    }

    const booking = new Booking({
      ...validatedData,
      user: req.user._id,
      car: validatedData.carId,
      totalCost: calculateTotalCost(
        car.pricePerHour,
        validatedData.startTime,
        validatedData.endTime,
      ),
    });
    await booking.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Car booked successfully',
      data: booking,
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

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate('car user');

    res.json({
      success: true,
      statusCode: 200,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('car');

    res.json({
      success: true,
      statusCode: 200,
      message: 'User bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const returnCar = async (req: Request, res: Response) => {
  const returnSchema = z.object({
    bookingId: z.string(),
    endTime: z.string(),
  });

  try {
    const validatedData = returnSchema.parse(req.body);
    const booking = await Booking.findById(validatedData.bookingId).populate(
      'car',
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.endTime = validatedData.endTime;
    booking.totalCost = calculateTotalCost(
      booking.car.pricePerHour,
      booking.startTime,
      validatedData.endTime,
    );
    await booking.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Car returned successfully',
      data: booking,
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

const calculateTotalCost = (
  pricePerHour: number,
  startTime: string,
  endTime?: string,
): number => {
  if (!endTime) return 0;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hours = (end - start) / (1000 * 60 * 60);
  return hours * pricePerHour;
};

export { bookCar, getAllBookings, getMyBookings, returnCar };
