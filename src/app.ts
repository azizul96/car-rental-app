import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import bookingRoutes from './routes/booking';
import authRoutes from './routes/auth';
import carRoutes from './routes/car';
import authenticate from './middlewares/authenticate';
import { notFound, errorHandler } from './middlewares/errorHandler';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/cars', authenticate, carRoutes);
app.use('/api/bookings', authenticate, bookingRoutes);

app.use(notFound);
app.use(errorHandler);

// MongoDB connection
const mongoURI = process.env.DATABASE_URL;
mongoose
  .connect(mongoURI as string)

  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
