import mongoose from 'mongoose';

const plannerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  departureDate: { type: String, required: true },
  country: { type: String, required: true },
  whatsapp: String,
  pax: String,
  rooms: String,
  hotelCategories: [String],
  mealPlans: [String],
  interests: [String],
  budget: String,
  otherRequirements: String,
  email: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Planner = mongoose.model('Planner', plannerSchema);
export default Planner;