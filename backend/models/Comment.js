// backend/models/Comment.js
// ----------------------------------------------------------
// Defines the Comment schema for video comments
// Each comment is linked to a video and an author (user)
// ----------------------------------------------------------

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // Text content of the comment
    text: {
      type: String,
      required: true,
    },

    // Reference to the user who wrote the comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the video where the comment was made
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model("Comment", commentSchema);
