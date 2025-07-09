// backend/controllers/videoController.js
// ----------------------------------------------------------
// Handles all video-related logic:
// Upload, Get, Update, Delete, Like/Dislike, Views, Search
// ----------------------------------------------------------

import fs from "fs";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";

import {
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
} from "../config/cloudinary.js";

// @desc    Get all videos (latest first)
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("uploader", "username")
      .populate("channel", "channelName channelBanner");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// @desc    Get single video by ID with full details
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username")
      .populate("channel", "channelName channelBanner")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
        options: { sort: { createdAt: -1 } },
      });

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Error fetching video" });
  }
};

// @desc    Upload new video with thumbnail
// @route   POST /api/videos
// @access  Private
export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user._id;

  // Ensure both video and thumbnail files are uploaded
  if (!req.files?.video?.[0] || !req.files?.thumbnail?.[0]) {
    return res.status(400).json({ error: "Video and thumbnail files are required." });
  }

  const channel = await Channel.findOne({ owner: userId });
  if (!channel) {
    return res.status(404).json({ error: "Channel not found for the user." });
  }

  try {
    const videoResult = await uploadVideoToCloudinary(req.files.video[0].buffer);
    const thumbnailResult = await uploadThumbnailToCloudinary(req.files.thumbnail[0].buffer);

    const newVideo = await Video.create({
      title,
      description,
      category,
      uploader: userId,
      channel: channel._id,
      videoUrl: videoResult.secure_url,
      videoPublicId: videoResult.public_id,
      thumbnailUrl: thumbnailResult.secure_url,
      thumbnailPublicId: thumbnailResult.public_id,
      duration: Math.floor(videoResult.duration),
    });

    // Add video reference to channel
    channel.videos.push(newVideo._id);
    await channel.save();

    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error("Video upload failed:", err);
    res.status(500).json({ error: "Video upload failed" });
  }
});

// @desc    Update video details or media
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Ensure only uploader can update
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this video" });
    }

    const { title, description, category } = req.body;

    // Helper function for cloudinary stream upload
    const streamUpload = (fileBuffer, options) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
          if (result) resolve(result);
          else reject(err);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Replace video if uploaded
    if (req.files?.video?.[0]) {
      await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });
      const result = await streamUpload(req.files.video[0].buffer, {
        resource_type: "video",
        folder: "youtube-clone/videos",
      });
      video.videoUrl = result.secure_url;
      video.videoPublicId = result.public_id;
      video.duration = Math.floor(result.duration);
    }

    // Replace thumbnail if uploaded
    if (req.files?.thumbnail?.[0]) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
      const result = await streamUpload(req.files.thumbnail[0].buffer, {
        folder: "youtube-clone/thumbnails",
      });
      video.thumbnailUrl = result.secure_url;
      video.thumbnailPublicId = result.public_id;
    }

    // Update other metadata
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating video" });
  }
};

// @desc    Delete a video and its comments/media
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this video" });
    }

    // Delete media from Cloudinary
    await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });
    await cloudinary.uploader.destroy(video.thumbnailPublicId);

    // Delete associated comments
    await Comment.deleteMany({ video: video._id });

    // Delete from DB and remove from channel
    await video.deleteOne();
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    res.json({ message: "Video and associated comments deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting video" });
  }
};

// @desc    Like/unlike a video
// @route   PUT /api/videos/like/:id
// @access  Private
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    // Toggle like
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
      video.likes.push(userId);
    }

    await video.save();
    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: "Failed to like video" });
  }
};

// @desc    Dislike/undislike a video
// @route   PUT /api/videos/dislike/:id
// @access  Private
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    // Toggle dislike
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
      video.dislikes.push(userId);
    }

    await video.save();
    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: "Failed to dislike video" });
  }
};

// @desc    Increase views of a video by 1
// @route   PUT /api/videos/views/:id
// @access  Public
export const increaseViews = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  video.views += 1;
  await video.save();

  res.status(200).json(video);
});

// @desc    Search videos by title or description
// @route   GET /api/videos/search?q=term
// @access  Public
export const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search term is required" });
  }

  const videos = await Video.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("uploader", "username")
    .populate("channel", "channelName channelBanner");

  res.status(200).json(videos);
});
