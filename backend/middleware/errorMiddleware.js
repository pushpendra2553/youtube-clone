// backend/middlewares/errorMiddleware.js
// ----------------------------------------------------------
// Global error handling middleware for handling 404 and general errors
// ----------------------------------------------------------

// @desc    Handle routes not found (404)
// @usage   Place after all routes in app.js
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Forward to the error handler
};

// @desc    General error handler (logs stack trace)
// @usage   Place after notFound middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Hide full stack in production
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
