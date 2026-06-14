const express = require('express');
const router = express.Router();
const { getActivityLogs, getActivityLogById } = require('../controllers/activityLogController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin'), getActivityLogs);
router.get('/:id', auth, authorize('admin'), getActivityLogById);

module.exports = router;
