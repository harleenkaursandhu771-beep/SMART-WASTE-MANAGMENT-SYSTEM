const mongoose = require('mongoose');

/**
 * WasteReport Schema
 * Citizens file waste reports against specific bins.
 * Each report tracks the issue, its status, and links to the citizen and bin.
 *
 * DBMS Constraints:
 * - description: required
 * - status: enum (pending, in-progress, resolved, rejected)
 * - citizenId: required reference
 * - binId: required reference
 * - reportId: required, unique
 */
const wasteReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: [true, 'Report ID is required'],
      unique: true,
      trim: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the citizen who filed the report
      required: [true, 'Citizen reference is required'],
    },
    binId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bin', // Reference to the bin being reported
      required: [true, 'Bin reference is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'resolved', 'rejected'],
        message: 'Status must be one of: Pending, In Progress, Resolved, Rejected',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true, // createdAt serves as the report timestamp
  }
);

// Custom error message for duplicate reportId
wasteReportSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('A report with this ID already exists.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('WasteReport', wasteReportSchema);
