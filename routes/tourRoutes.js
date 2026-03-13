import express from 'express';
import Tour from '../models/Tour.js';

const router = express.Router();

// @desc    Fetch all tours
// @route   GET /api/tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch tours" });
  }
});

// @desc    Fetch a single tour by ID
// @route   GET /api/tours/:id
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid Tour ID" });
  }
});

// @desc    Create a new tour (For Admin Use)
// @route   POST /api/tours
router.post('/', async (req, res) => {
  try {
    const { title, description, price, image, location, duration } = req.body;
    
    const newTour = new Tour({
      title,
      description,
      price,
      image,
      location,
      duration
    });

    const createdTour = await newTour.save();
    res.status(201).json(createdTour);
  } catch (error) {
    res.status(400).json({ message: "Error creating tour: " + error.message });
    console.log(error);
  }
});

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
router.delete('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      await tour.deleteOne();
      res.json({ message: "Tour removed successfully" });
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour" });
  }
});

// Add this route to server/routes/tourRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;