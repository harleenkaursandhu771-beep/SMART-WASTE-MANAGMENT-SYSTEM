const mongoose = require('mongoose');

/**
 * ActivityLog Schema
 * Stores audits of actions performed in the system.
 * Useful for DBMS academic requirements.
 *
 * DBMS Constraints:
 * - action: required
 * - entityType: required, enum
 * - entityId: required
 */
const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Action description is required'],
      trim: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: {
        values: ['User', 'Bin', 'WasteReport', 'CollectionTask', 'Vehicle', 'Feedback', 'Notification'],
        message: 'Entity type must be one of: User, Bin, WasteReport, CollectionTask, Vehicle, Feedback, Notification',
      },
      trim: true,
    },
    entityId: {
      type: String,
      required: [true, 'Entity ID is required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
