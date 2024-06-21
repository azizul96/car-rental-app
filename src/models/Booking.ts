import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICar } from './Car';

interface IBooking extends Document {
  date: Date;
  user: IUser | mongoose.Schema.Types.ObjectId;
  car: ICar | mongoose.Schema.Types.ObjectId;
  startTime: string;
  endTime: string | null;
  totalCost: number;
}

const BookingSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, default: null },
    totalCost: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
