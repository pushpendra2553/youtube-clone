// backend/models/User.js
// ----------------------------------------------------------
// Defines the User schema for authentication and profile management
// Stores user details, profile picture, owned channels, and subscriptions
// ----------------------------------------------------------

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Unique username for display
    username: {
      type: String,
      required: true,
    },

    // Unique email for login
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },

    // Optional profile picture URL (Cloudinary)
    profilePic: {
      type: String,
    },

    // Channels owned by the user
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],

    // Channels the user is subscribed to
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true } // Auto-manages createdAt and updatedAt
);

export default mongoose.model("User", userSchema);
