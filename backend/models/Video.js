// backend/models/Video.js
// ----------------------------------------------------------
// Defines the Video schema for uploaded video content
// Includes references to uploader, channel, media URLs, interactions
// ----------------------------------------------------------

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    // Title of the video
    title: {
      type: String,
      required: true,
    },

    // Optional description
    description: {
      type: String,
    },

    // Category (e.g. Music, Gaming, Education)
    category: {
      type: String,
      required: true,
    },

    // Cloudinary video URL
    videoUrl: {
      type: String,
      required: true,
    },

    // Cloudinary video public ID for deletion
    videoPublicId: {
      type: String,
      required: true,
    },

    // Thumbnail image URL
    thumbnailUrl: {
      type: String,
      required: true,
    },

    // Cloudinary thumbnail public ID for deletion
    thumbnailPublicId: {
      type: String,
      required: true,
    },

    // Reference to the user who uploaded the video
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the channel where the video belongs
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    // Users who liked this video
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users who disliked this video
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments related to this video
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    // Duration in seconds (from Cloudinary)
    duration: {
      type: Number,
    },

    // View count
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Auto-manages createdAt and updatedAt
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
