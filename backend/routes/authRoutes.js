// backend/routes/authRoutes.js
// ----------------------------------------------------------
// Authentication-related routes:
// Register, Login, Get current logged-in user
// ----------------------------------------------------------

import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controllers/authController.js';

import { uploadProfile } from '../middleware/multer.js'; // Handles profile image upload
import { protect } from '../middleware/authMiddleware.js'; // Secures /me route

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user with profile picture upload
// @access  Public
router.post('/register', uploadProfile, registerUser);

// @route   POST /api/auth/login
// @desc    Log in user and return JWT token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get details of logged-in user
// @access  Private (Requires JWT)
router.get('/me', protect, getMe);

export default router;
