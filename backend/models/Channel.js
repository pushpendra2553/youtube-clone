// backend/models/Channel.js
// ----------------------------------------------------------
// Defines the Channel schema: used to group videos and track subscribers
// Linked to a User (owner) and stores uploaded videos and subscribers
// ----------------------------------------------------------

import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    // Unique identifier for the channel (used like YouTube's channelId)
    channelId: {
      type: String,
      required: true,
      unique: true,
    },

    // Display name of the channel
    channelName: {
      type: String,
      required: true,
    },

    // Optional text about the channel
    description: {
      type: String,
    },

    // Cloudinary URL of the banner image
    channelBanner: {
      type: String,
    },

    // Cloudinary public ID of the banner (used for deletion)
    bannerPublicId: {
      type: String,
    },

    // Reference to the user who owns the channel
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Total number of subscribers
    subscribers: {
      type: Number,
      default: 0,
    },

    // Array of users who subscribed to this channel
    subscribersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Array of videos uploaded by this channel
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.model('Channel', channelSchema);
