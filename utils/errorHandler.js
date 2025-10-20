// Async error handler wrapper
const handleAsyncError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class KyroError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response formatter
const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  };

  res.status(statusCode).json(errorResponse);
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  // Handle different types of errors
  let error = { ...err };
  error.message = err.message;

  // Log the error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new KyroError(message, 404, 'RESOURCE_NOT_FOUND');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new KyroError(message, 400, 'DUPLICATE_FIELD');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new KyroError(message, 400, 'VALIDATION_ERROR');
  }

  sendError(res, error);
};

module.exports = {
  handleAsyncError,
  KyroError,
  sendError,
  globalErrorHandler
};