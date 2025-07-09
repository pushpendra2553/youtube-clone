// backend/controllers/authController.js
// -----------------------------------------
// Handles user authentication: register, login, get logged-in user info
// -----------------------------------------

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadUserProfileToCloudinary } from "../config/cloudinary.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profile = req.file; // profile image from multer

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary if provided
    let uploadedProfileImage;
    if (profile) {
      uploadedProfileImage = await uploadUserProfileToCloudinary(profile.buffer);
    }

    // Create new user document in MongoDB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic: uploadedProfileImage?.secure_url || "", // use empty string if not uploaded
    });

    // Return success response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and populate their channels
    const user = await User.findOne({ email }).populate("channels");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token valid for 1 day
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send user data and token
    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        channels: user.channels,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get details of logged-in user
// @route   GET /api/auth/me
// @access  Private (requires auth middleware)
export const getMe = async (req, res) => {
  try {
    // Get user from DB, excluding password
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("channels");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
