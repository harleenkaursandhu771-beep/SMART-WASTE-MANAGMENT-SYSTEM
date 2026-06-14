const mongoose = require('mongoose');

/**
 * Feedback Schema
 * Citizens submit feedback about the waste management service.
 * Tracks rating and optional comments linked to the citizen.
 *
 * DBMS Constraints:
 * - citizenId: required reference
 * - rating: required, min 1, max 5
 * - comment: optional
 */
const feedbackSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the citizen providing feedback
      required: [true, 'Citizen reference is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v >= 1 && v <= 5;
        },
        message: 'Rating must be a whole number between 1 and 5',
      },
    },
    comment: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
