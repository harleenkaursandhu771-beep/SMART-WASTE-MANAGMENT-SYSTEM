/**
 * Error Handler Utility
 * Parses Mongoose validation errors and MongoDB duplicate key errors
 * into user-friendly error messages for the frontend.
 */

const parseValidationError = (error) => {
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return {
      statusCode: 400,
      message: messages.length === 1 ? messages[0] : 'Validation failed',
      errors: messages,
    };
  }

  // MongoDB duplicate key error
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    const friendlyNames = {
      email: 'Email already exists. Please use a different email address.',
      binId: 'A bin with this ID already exists.',
      reportId: 'A report with this ID already exists.',
      taskId: 'A task with this ID already exists.',
      vehicleId: 'A vehicle with this ID already exists.',
      vehicleNumber: 'A vehicle with this registration number already exists.',
    };
    return {
      statusCode: 400,
      message: friendlyNames[field] || `Duplicate value for field: ${field}`,
      errors: [friendlyNames[field] || `Duplicate value for field: ${field}`],
    };
  }

  // CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    return {
      statusCode: 400,
      message: `Invalid ${error.path}: ${error.value}`,
      errors: [`Invalid ${error.path}: ${error.value}`],
    };
  }

  // Default
  return {
    statusCode: 500,
    message: error.message || 'Internal server error',
    errors: [error.message || 'Internal server error'],
  };
};

module.exports = { parseValidationError };
