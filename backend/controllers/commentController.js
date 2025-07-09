// backend/controllers/commentController.js
// ----------------------------------------------------------
// Handles all comment-related operations for videos:
// Add, Retrieve, Edit, and Delete comments
// ----------------------------------------------------------

import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// @desc    Add a new comment to a video
// @route   POST /api/comments/:videoId
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    // Validate input
    if (!text || !videoId) {
      return res.status(400).json({ message: "Text and videoId are required" });
    }

    // Create comment document
    const comment = await Comment.create({
      text,
      video: videoId,
      author: req.user._id,
    });

    // Link comment to the video
    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    });

    // Populate author field with username and _id
    const populatedComment = await comment.populate("author", "username _id");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add comment",
      error: err.message,
    });
  }
};

// @desc    Get all comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
export const getCommentsByVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    // Fetch all comments for this video, sorted by most recent
    const comments = await Comment.find({ video: videoId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: err.message,
    });
  }
};

// @desc    Edit a comment (only by its author)
// @route   PUT /api/comments/:commentId
// @access  Private
export const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;

    // Find comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure the user editing the comment is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    // Update text if provided
    comment.text = text || comment.text;
    await comment.save();

    const populatedComment = await comment.populate("author", "username _id");

    res.json({
      message: "Comment updated",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to edit comment",
      error: err.message,
    });
  }
};

// @desc    Delete a comment (only by its author)
// @route   DELETE /api/comments/:commentId/:videoId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { commentId, videoId } = req.params;

    // Find comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure user deleting is the comment's author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Remove comment reference from video
    await Video.findByIdAndUpdate(videoId, {
      $pull: { comments: comment._id },
    });

    // Delete comment from database
    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: err.message,
    });
  }
};
