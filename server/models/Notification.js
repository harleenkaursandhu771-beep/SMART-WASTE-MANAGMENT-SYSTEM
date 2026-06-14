const mongoose = require('mongoose');

/**
 * Notification Schema
 * System notifications sent to users (admin alerts, task updates, report status changes).
 *
 * DBMS Constraints:
 * - message: required
 * - recipientId: required reference
 * - type: enum
 */
const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user receiving the notification
      required: [true, 'Recipient is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['info', 'warning', 'success', 'error', 'task', 'report'],
        message: 'Type must be one of: info, warning, success, error, task, report',
      },
      default: 'info',
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // timestamp = createdAt
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
