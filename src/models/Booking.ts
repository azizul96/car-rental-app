import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
  date: Date;
  user: mongoose.Schema.Types.ObjectId;
  car: mongoose.Schema.Types.ObjectId;
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
