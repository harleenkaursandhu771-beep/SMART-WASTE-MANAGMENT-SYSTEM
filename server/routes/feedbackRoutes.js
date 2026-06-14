const express = require('express');
const router = express.Router();
const { createFeedback, getFeedback, getFeedbackById, deleteFeedback } = require('../controllers/feedbackController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createFeedback);
router.get('/', auth, authorize('admin'), getFeedback);
router.get('/:id', auth, authorize('admin'), getFeedbackById);
router.delete('/:id', auth, authorize('admin'), deleteFeedback);

module.exports = router;
