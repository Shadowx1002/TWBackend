import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  // Basic Requirements (Matches your schema)
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Main cover image
  location: { type: String, required: true }, // Simple location string
  duration: { type: Number, default: 3 }, // Stored as a number for better frontend sorting
  featured: { type: Boolean, default: false },
  
  // Advanced Features (To match your new Frontend/Admin Dashboard)
  name: { type: String }, // Optional fallback for title
  summary: { type: String }, // Short text for the small cards
  imageCover: { type: String }, // Fallback for image
  images: [String], // Array of extra gallery images
  difficulty: { type: String, default: 'medium' },
  maxGroupSize: { type: Number, default: 10 },
  highlights: [String], // e.g., ["Wildlife Safari", "5-Star Hotels"]
  startDates: [Date],

  // Interactive Map & Itinerary Data
  timeline: [
    {
      day: Number,
      title: String, 
      description: String,
      stops: [
        {
          name: String, 
          type: { type: String, enum: ['Hotel', 'Restaurant', 'Attraction', 'Activity'] },
          image: String,
          description: String
        }
      ]
    }
  ]
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;