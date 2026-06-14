const mongoose = require('mongoose');

/**
 * Vehicle Schema
 * Represents waste collection vehicles in the fleet.
 * Tracks vehicle capacity, driver, and operational status.
 *
 * DBMS Constraints:
 * - vehicleId: required, unique
 * - vehicleNumber: required, unique
 * - driverName: required
 * - capacity: required, min 0
 * - status: enum (available, in-use, maintenance, retired)
 */
const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: [true, 'Vehicle ID is required'],
      unique: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      unique: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
      minlength: [2, 'Driver name must be at least 2 characters'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [0, 'Capacity cannot be negative'],
      max: [50000, 'Capacity cannot exceed 50,000 kg'],
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'in-use', 'maintenance', 'retired'],
        message: 'Status must be one of: Available, In Use, Maintenance, Retired',
      },
      default: 'available',
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Custom error message for duplicate vehicle fields
vehicleSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    if (field === 'vehicleNumber') {
      next(new Error('A vehicle with this registration number already exists.'));
    } else if (field === 'vehicleId') {
      next(new Error('A vehicle with this ID already exists.'));
    } else {
      next(new Error('Duplicate value found. Please use unique values.'));
    }
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
