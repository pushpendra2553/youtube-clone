//backend/config/cloudinary.js----->
// Import necessary modules
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary SDK
import dotenv from "dotenv"; // To load environment variables from .env file
import streamifier from "streamifier"; // Helps in converting buffer to readable stream

// Load environment variables
dotenv.config();

// Configure cloudinary using credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Function to upload videos to Cloudinary under the folder: youtube-clone/videos
const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // Specify this is a video file
        folder: "youtube-clone/videos", // Folder in Cloudinary
      },
      (err, result) => {
        if (err) return reject(err); // Reject the promise if there's an error
        resolve(result); // Resolve the result on successful upload
      }
    ).end(fileBuffer); // Pass the video file as buffer
  });
};

// Function to upload thumbnails (images) to Cloudinary under: youtube-clone/thumbnails
const uploadThumbnailToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image", // This is an image file
        folder: "youtube-clone/thumbnails",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    ).end(fileBuffer); // Pass the image file as buffer
  });
};

// Function to upload user profile pictures to Cloudinary under: youtube-clone/profiles
const uploadUserProfileToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Convert fileBuffer to a readable stream and pipe it to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "youtube-clone/profiles" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Function to upload channel banners to Cloudinary under: youtube-clone/channel-banners
const uploadChanelBannerToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "youtube-clone/channel-banners" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    ).end(fileBuffer);
  });
};

// Export all functions and the configured Cloudinary instance for reuse
export {
  cloudinary,
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
  uploadUserProfileToCloudinary,
  uploadChanelBannerToCloudinary
};
