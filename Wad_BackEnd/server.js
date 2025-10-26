import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import your route files
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import budgetRoutes from './routes/budget.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/budget', budgetRoutes);

// --- DATABASE CONNECTION ---
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((error) => console.error('MongoDB connection error:', error.message));
}

// --- EXPORT THE APP ---
// This is the most important change for Vercel
export default app;