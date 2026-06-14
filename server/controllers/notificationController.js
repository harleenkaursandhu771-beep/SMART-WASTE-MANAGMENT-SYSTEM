const Notification = require('../models/Notification');
const { logActivity } = require('../utils/activityLogger');

/**
 * Get all notifications (optionally filter by recipientId via query param)
 * GET /api/notifications
 * GET /api/notifications?recipientId=<userId>
 */
const getNotifications = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.recipientId = req.user._id;
    } else if (req.query.recipientId) {
      filter.recipientId = req.query.recipientId;
    }

    const notifications = await Notification.find(filter)
      .populate('recipientId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get notification by ID
 * GET /api/notifications/:id
 */
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('recipientId', 'name email role');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (req.user.role !== 'admin' && String(notification.recipientId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new notification (Admin only or system internal)
 * POST /api/notifications
 */
const createNotification = async (req, res) => {
  try {
    const { recipientId, message, type } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ message: 'recipientId and message are required' });
    }

    const notification = await Notification.create({
      recipientId,
      message,
      type: type || 'info',
      readStatus: false,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('recipientId', 'name email role');

    // Log action
    await logActivity('NOTIFICATION_CREATED', 'Notification', notification._id, req.user?._id, `Notification sent to recipient ${recipientId}`);

    res.status(201).json({ message: 'Notification created successfully', notification: populatedNotification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (req.user.role !== 'admin' && String(notification.recipientId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to modify this notification' });
    }

    notification.readStatus = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (req.user.role !== 'admin' && String(notification.recipientId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getNotifications, getNotificationById, createNotification, markAsRead, deleteNotification };
