import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  guests: { type: Number, required: true },
  // In your MongoDB Schema
status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;