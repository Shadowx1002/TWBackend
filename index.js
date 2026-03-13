import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import bookingRoutes from './routes/bookingRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import transportRoutes from './routes/transportRoutes.js';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// --- SECURE PRODUCTION CORS ---
const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'https://twbackend-6i00.onrender.com', // <-- CHANGE THIS to your exact Vercel URL
        // 'https://www.yourcustomdomain.com' // Uncomment later when you buy a domain
    ],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // Allows us to accept JSON data in the body

app.get('/', (req, res) => {
  res.send('API is running smoothly...');
});

app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/transport', transportRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server flying on port ${PORT}`));