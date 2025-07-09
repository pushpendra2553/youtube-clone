// backend/routes/commentRoutes.js
// ----------------------------------------------------------
// Comment routes (nested under video):
// Add, Get, Edit, Delete comments for videos
// ----------------------------------------------------------

import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getCommentsByVideo,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

// `mergeParams: true` allows access to `videoId` from parent route
const router = express.Router({ mergeParams: true });

// @route   POST /api/videos/:videoId/comments
// @desc    Add a comment to a specific video
// @access  Private
router.post("/", protect, addComment);

// @route   GET /api/videos/:videoId/comments
// @desc    Get all comments for a specific video
// @access  Public
router.get("/", getCommentsByVideo);

// @route   PUT /api/videos/:videoId/comments/:commentId
// @desc    Edit a comment (by its author)
// @access  Private
router.put("/:commentId", protect, editComment);

// @route   DELETE /api/videos/:videoId/comments/:commentId
// @desc    Delete a comment (by its author)
// @access  Private
router.delete("/:commentId", protect, deleteComment);

export default router;
