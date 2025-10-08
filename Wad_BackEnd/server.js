// Wad_BackEnd/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import your route files
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import budgetRoutes from './routes/budget.js';

// --- This MUST be at the very top ---
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- CORRECTED API ROUTES ---
// We tell the app to use the route files directly.
// The security middleware is now correctly handled *inside* the route files, not here.
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/budget', budgetRoutes);


// --- CORRECTED DATABASE CONNECTION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in your .env file.");
    process.exit(1);
}

// The deprecated options have been removed for a clean connection.
mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running successfully on port: ${PORT}`));
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });