import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL of the image
  location: { type: String, required: true },
  duration: { type: String, default: "3 Days" },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;