// backend/middlewares/authMiddleware.js
// ----------------------------------------------------------
// Middleware to protect private routes using JWT authentication
// Extracts the user from the token and attaches it to req.user
// ----------------------------------------------------------

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Protect routes - Only accessible with valid token
// @usage   Use as middleware in routes: router.get('/profile', protect, handler)
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token part (after "Bearer")
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded userId and exclude password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found from token' });
    }

    // Attach full user object to req.user
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
