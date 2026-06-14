const mongoose = require('mongoose');

/**
 * Bin Schema
 * Represents physical waste bins deployed across the city.
 * Each bin tracks its fill level, location, and the worker assigned to it.
 *
 * DBMS Constraints:
 * - binId: required, unique
 * - wasteLevel: min 0, max 100
 * - status: enum (active, inactive, full, maintenance)
 * - location, area: required
 * - latitude, longitude: required
 */
const binSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      required: [true, 'Bin ID is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
      maxlength: [100, 'Area name cannot exceed 100 characters'],
    },
    wasteLevel: {
      type: Number,
      default: 0,
      min: [0, 'Waste level cannot be less than 0'],
      max: [100, 'Waste level cannot exceed 100'],
      validate: {
        validator: Number.isFinite,
        message: 'Waste level must be a valid number between 0 and 100',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'full', 'maintenance'],
        message: 'Status must be one of: active, inactive, full, maintenance',
      },
      default: 'active',
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the worker assigned to this bin
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Custom error message for duplicate binId
binSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A bin with this ID already exists. Please use a different Bin ID.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Bin', binSchema);
