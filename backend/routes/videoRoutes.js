// backend/routes/videoRoutes.js
// ----------------------------------------------------------
// Video routes:
// Upload, Read, Update, Delete, Like, Dislike, Views, Comments, Search
// ----------------------------------------------------------

import express from 'express';
import {
  searchVideos,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  uploadVideo,
  increaseViews,
} from '../controllers/videoController.js';

import { protect } from '../middleware/authMiddleware.js';
import { uploadBoth } from '../middleware/multer.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

// Mount comment routes as nested under videos
// Example: /api/videos/:videoId/comments
router.use('/:videoId/comments', commentRoutes);

// @route   GET /api/videos/search?q=keyword
// @desc    Search videos by title or description
// @access  Public
router.get('/search', searchVideos);

// @route   GET /api/videos
// @desc    Fetch all videos
// @access  Public
router.get('/', getAllVideos);

// @route   GET /api/videos/:id
// @desc    Get a single video by ID
// @access  Public
router.get('/:id', getVideoById);

// @route   PUT /api/videos/:id
// @desc    Update video info or re-upload media
// @access  Private (Uploader only)
router.put('/:id', protect, uploadBoth, updateVideo);

// @route   DELETE /api/videos/:id
// @desc    Delete a video
// @access  Private (Uploader only)
router.delete('/:id', protect, deleteVideo);

// @route   POST /api/videos/:id/like
// @desc    Like or unlike a video
// @access  Private
router.post('/:id/like', protect, likeVideo);

// @route   POST /api/videos/:id/dislike
// @desc    Dislike or undislike a video
// @access  Private
router.post('/:id/dislike', protect, dislikeVideo);

// @route   POST /api/videos/upload
// @desc    Upload a new video + thumbnail
// @access  Private
router.post('/upload', protect, uploadBoth, uploadVideo);

// @route   PATCH /api/videos/:id/views
// @desc    Increment view count for a video
// @access  Public
router.patch('/:id/views', increaseViews);

export default router;
