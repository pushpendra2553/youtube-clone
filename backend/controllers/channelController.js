// backend/controllers/channelController.js
// ----------------------------------------------------------
// This controller handles channel operations:
// Create, Read, Update, Delete, and Subscribe/Unsubscribe
// ----------------------------------------------------------

import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import {
  uploadChanelBannerToCloudinary,
  cloudinary,
} from "../config/cloudinary.js";
import { nanoid } from "nanoid";

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  try {
    // Check if user already owns a channel
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: "You already have a channel." });
    }

    let channelBanner = null;
    let bannerPublicId = null;

    // Upload banner image to Cloudinary (if provided)
    if (req.file) {
      try {
        const result = await uploadChanelBannerToCloudinary(req.file.buffer);
        channelBanner = result.secure_url;
        bannerPublicId = result.public_id;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res.status(500).json({ message: "Failed to upload banner image" });
      }
    }

    // Create and save channel
    const newChannel = new Channel({
      channelId: nanoid(12),
      channelName: req.body.channelName,
      description: req.body.description,
      channelBanner,
      bannerPublicId,
      owner: req.user._id,
    });

    const savedChannel = await newChannel.save();

    // Link the channel to the user
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { channels: savedChannel._id } },
      { new: true }
    );

    res.status(201).json(savedChannel);
  } catch (err) {
    console.error("Error in createChannel:", err);
    res.status(500).json({ error: err.message || "Failed to create channel" });
  }
};

// @desc    Get a channel and its videos
// @route   GET /api/channels/:id
// @access  Public
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channel._id });
    res.json({ channel, videos });
  } catch (err) {
    console.error("Error in getChannel:", err.message);
    res.status(500).json({ error: "Error fetching channel" });
  }
};

// @desc    Update a channel's info or banner
// @route   PUT /api/channels/:id
// @access  Private (only owner)
export const updateChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only owner can update the channel
    if (channel.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this channel" });
    }

    const { channelName, description } = req.body;

    // Handle banner image replacement
    if (req.file) {
      if (channel.bannerPublicId) {
        await cloudinary.uploader.destroy(channel.bannerPublicId);
      }

      const result = await uploadChanelBannerToCloudinary(req.file.buffer);
      channel.channelBanner = result.secure_url;
      channel.bannerPublicId = result.public_id;
    }

    // Update other fields
    if (channelName) channel.channelName = channelName;
    if (description) channel.description = description;

    await channel.save();
    res.status(200).json(channel);
  } catch (err) {
    console.error("Error updating channel:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a channel, its videos, and related comments
// @route   DELETE /api/channels/:id
// @access  Private (only owner)
export const deleteChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.owner.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this channel" });
    }

    // Fetch and delete all related comments
    const videos = await Video.find({ channel: channel._id });
    const videoIds = videos.map((video) => video._id);
    await Comment.deleteMany({ video: { $in: videoIds } });

    // Delete media from Cloudinary
    for (const video of videos) {
      try {
        if (video.videoPublicId) {
          await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });
        }
        if (video.thumbnailPublicId) {
          await cloudinary.uploader.destroy(video.thumbnailPublicId);
        }
      } catch (err) {
        console.error("Cloudinary deletion error for video:", err.message);
      }
    }

    // Delete videos from DB
    await Video.deleteMany({ channel: channel._id });

    // Delete channel banner from Cloudinary
    if (channel.bannerPublicId) {
      try {
        await cloudinary.uploader.destroy(channel.bannerPublicId);
      } catch (err) {
        console.error("Failed to delete banner:", err.message);
      }
    }

    // Remove the channel itself
    await channel.deleteOne();

    // Optional: remove reference from user document
    await User.findByIdAndUpdate(userId, { $pull: { channels: channel._id } });

    res.json({ message: "Channel, videos, banner, and comments deleted successfully" });
  } catch (err) {
    console.error("Error deleting channel:", err);
    res.status(500).json({ error: err.message || "Failed to delete channel" });
  }
};

// @desc    Subscribe or Unsubscribe to a channel
// @route   PUT /api/channels/:id/subscribe
// @access  Private
export const toggleSubscription = async (req, res) => {
  const userId = req.user._id;
  const channelId = req.params.id;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  const alreadySubscribed = channel.subscribersList.includes(userId);

  if (alreadySubscribed) {
    channel.subscribersList.pull(userId);
  } else {
    channel.subscribersList.push(userId);
  }

  channel.subscribers = channel.subscribersList.length;
  await channel.save();

  const updatedChannel = await Channel.findById(channelId).populate("owner", "name");

  // Reflect changes in user subscriptions
  const user = await User.findById(userId);
  if (alreadySubscribed) {
    user.subscriptions.pull(channelId);
  } else {
    user.subscriptions.push(channelId);
  }

  await user.save();

  res.status(200).json(updatedChannel);
};
