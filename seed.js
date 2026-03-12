import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './models/Tour.js'; // Ensure the path and extension are correct

dotenv.config();

const tours = [
  {
    title: "The Glass Maldivian",
    description: "Ultra-luxury overwater villas with private infinity pools and 24/7 butler service. Featuring floor-to-ceiling glass for total ocean immersion.",
    price: 1250,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    location: "Maldives",
    duration: "5 Days"
  },
  {
    title: "Kyoto Zen Retreat",
    description: "Experience ultimate peace in a modern Ryokan. Includes private tea ceremonies, minimalist design, and guided forest bathing sessions.",
    price: 890,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    location: "Kyoto, Japan",
    duration: "4 Days"
  },
  {
    title: "Swiss Alpine Loft",
    description: "Modern glass-front cabins in the heart of the Alps. Private ski-in/ski-out access and outdoor heated spa pools under the stars.",
    price: 1100,
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    location: "Zermatt, Switzerland",
    duration: "6 Days"
  },
  {
    title: "Santorini Sunset Suite",
    description: "Whitewashed architecture meeting deep blue waters. Private terraces with hot tubs overlooking the world-famous Oia sunset.",
    price: 950,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    location: "Santorini, Greece",
    duration: "3 Days"
  }
];

const seedDatabase = async () => {
  try {
    // 1. Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file!");
    }

    // 2. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 Connected to MongoDB Atlas...");

    // 3. Clear existing data (to avoid duplicates every time you run this)
    await Tour.deleteMany();
    console.log("🧹 Old tours cleared.");

    // 4. Insert the new "Premium" data
    await Tour.insertMany(tours);
    console.log("✨ Seed Successful: 4 Premium Tours added to Database!");

    // 5. Close the connection
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();