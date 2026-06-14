const express = require('express');
const router = express.Router();
const { getNotifications, getNotificationById, createNotification, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getNotifications);
router.get('/:id', auth, getNotificationById);
router.post('/', auth, authorize('admin'), createNotification);
router.put('/:id', auth, markAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
