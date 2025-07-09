// backend/config/db.js
// -----------------------------------------
// MongoDB connection configuration using Mongoose
// This function connects to the MongoDB database using URI from .env
// -----------------------------------------

import mongoose from "mongoose";

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log the host name on successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log any error that occurs during connection and exit the process
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
