// backend/routes/channelRoutes.js
// ----------------------------------------------------------
// Channel routes: Create, Read, Update, Delete, Subscribe
// ----------------------------------------------------------

import express from 'express';
import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  toggleSubscription,
} from '../controllers/channelController.js';

import { protect } from '../middleware/authMiddleware.js'; // Auth middleware
import { uploadBanner } from '../middleware/multer.js';   // Banner upload middleware

const router = express.Router();

// @route   POST /api/channels
// @desc    Create a new channel (with optional banner)
// @access  Private
router.post('/', protect, uploadBanner, createChannel);

// @route   GET /api/channels/:id
// @desc    Get a channel and its videos by channel ID
// @access  Public
router.get('/:id', getChannel);

// @route   PUT /api/channels/:id
// @desc    Update channel details or banner
// @access  Private (Only channel owner)
router.put('/:id', protect, uploadBanner, updateChannel);

// @route   DELETE /api/channels/:id
// @desc    Delete a channel and all associated videos/comments
// @access  Private (Only channel owner)
router.delete('/:id', protect, deleteChannel);

// @route   POST /api/channels/:id/subscribe
// @desc    Toggle subscribe/unsubscribe to a channel
// @access  Private
router.post('/:id/subscribe', protect, toggleSubscription);

export default router;
