// backend/middlewares/multer.js
// ----------------------------------------------------------
// Configures Multer for handling video/image uploads in memory
// Used for uploading: videos, thumbnails, profile pics, banners
// ----------------------------------------------------------

import multer from "multer";

// Use memory storage to keep files in memory (suitable for streaming to Cloudinary)
const storage = multer.memoryStorage();

// Custom file filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/quicktime",    // .mov
    "video/x-msvideo",    // .avi
  ];

  // Allow file if MIME type is valid
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG images and MP4, MOV, AVI videos are allowed!"));
  }
};

// Middleware to upload both video and thumbnail in a single request
export const uploadBoth = multer({ storage, fileFilter }).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// Middleware for uploading single profile picture
export const uploadProfile = multer({ storage, fileFilter }).single("profile");

// Middleware for uploading single channel banner
export const uploadBanner = multer({ storage, fileFilter }).single("banner");
