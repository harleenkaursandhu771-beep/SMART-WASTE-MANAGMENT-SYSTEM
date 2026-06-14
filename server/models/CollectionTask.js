const mongoose = require('mongoose');

/**
 * CollectionTask Schema
 * Tasks assigned to workers for collecting waste from specific bins.
 * Tracks the worker, bin, scheduled date, and completion status.
 *
 * DBMS Constraints:
 * - taskId: required, unique
 * - workerId: required reference
 * - binId: required reference
 * - collectionDate: required
 * - status: enum (pending, in-progress, completed, cancelled)
 */
const collectionTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: [true, 'Task ID is required'],
      unique: true,
      trim: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the assigned worker
      required: [true, 'Worker assignment is required'],
    },
    binId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bin', // Reference to the target bin
      required: [true, 'Bin assignment is required'],
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed', 'cancelled'],
        message: 'Status must be one of: Pending, In Progress, Completed, Cancelled',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Custom error message for duplicate taskId
collectionTaskSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A task with this ID already exists.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('CollectionTask', collectionTaskSchema);
