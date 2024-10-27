import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
// import Proposal from './models/EventProposal.js'; // Ensure this path is correct
// import authenticateJWT from './middleware/auth.js'; // Ensure this path is correct

// Load environment variables from .env file
config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(json());
app.use(bodyParser.json()); // Parse JSON bodies

// Define routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/events', eventRoutes); // Event routes

// Hardcoded admin credentials (for demonstration purposes)
const adminCredentials = {
  email: 'admin@gmail.com',
  password: 'Admin',
  dob: '2000-01-01', // Change format to YYYY-MM-DD for consistency
};

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { email, password, dob } = req.body;

  // Check if the credentials match
  if (
    email === adminCredentials.email &&
    password === adminCredentials.password &&
    dob === adminCredentials.dob // Use dob directly for comparison
  ) {
    // Generate a token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Connect to MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.error('MongoDB connection error:', error));



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
