// backend/server.js
// ----------------------------------------------------------
// Entry point of the YouTube Clone backend API
// Connects to MongoDB, sets up middleware, routes, and starts the server
// ----------------------------------------------------------

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

// Error handling middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ----------------------------------------------------------
// Middleware
// ----------------------------------------------------------

// Enable CORS for frontend (adjust origin if deploying)
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend URL
  credentials: true,
}));

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------
// API Routes
// ----------------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/channels', channelRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('YouTube Clone API is running...');
});

// ----------------------------------------------------------
// Error Handlers
// ----------------------------------------------------------

app.use(notFound);       // Handles 404
app.use(errorHandler);   // Handles all other errors

// ----------------------------------------------------------
// Start Server
// ----------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
