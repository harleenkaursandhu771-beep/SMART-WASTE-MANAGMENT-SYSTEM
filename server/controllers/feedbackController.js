const Feedback = require('../models/Feedback');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Submit feedback
 * POST /api/feedback
 */
const createFeedback = async (req, res) => {
  try {
    const { citizenId, rating, comment } = req.body;

    const feedback = await Feedback.create({
      citizenId,
      rating,
      comment: comment || '',
    });

    // Log action
    await logActivity('FEEDBACK_SUBMITTED', 'Feedback', feedback._id, req.user?._id, `Rating: ${rating}`);

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Get all feedback
 * GET /api/feedback
 */
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('citizenId', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get feedback by ID (Admin only)
 * GET /api/feedback/:id
 */
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('citizenId', 'name email');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Delete feedback (Admin only)
 * DELETE /api/feedback/:id
 */
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    // Log action
    await logActivity('FEEDBACK_DELETED', 'Feedback', req.params.id, req.user?._id, `Deleted feedback from citizen ${feedback.citizenId}`);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createFeedback, getFeedback, getFeedbackById, deleteFeedback };
