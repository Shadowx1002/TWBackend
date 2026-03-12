import express from 'express';
import Booking from '../models/Booking.js';


const router = express.Router();

// POST a new booking
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



export default router;