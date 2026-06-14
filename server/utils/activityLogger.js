const ActivityLog = require('../models/ActivityLog');

/**
 * Log a system activity
 * @param {string} action - Name of the action (e.g. USER_LOGIN, BIN_UPDATED)
 * @param {string} entityType - Collection/entity type (e.g. User, Bin)
 * @param {string} entityId - String identifier of the entity
 * @param {string} userId - ObjectId of the user performing the action (optional)
 * @param {string} details - Additional comments/metadata
 */
const logActivity = async (action, entityType, entityId, userId, details = '') => {
  try {
    await ActivityLog.create({
      action,
      entityType,
      entityId: String(entityId),
      userId: userId || null,
      details,
    });
  } catch (error) {
    console.error('❌ Failed to create activity log:', error.message);
  }
};

module.exports = { logActivity };
