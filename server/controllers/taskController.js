const CollectionTask = require('../models/CollectionTask');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Create a new collection task (Admin only)
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { taskId, workerId, binId, collectionDate, status } = req.body;

    const existingTask = await CollectionTask.findOne({ taskId });
    if (existingTask) {
      return res.status(400).json({ message: 'A task with this ID already exists.' });
    }

    const task = await CollectionTask.create({
      taskId,
      workerId,
      binId,
      collectionDate,
      status: status || 'pending',
    });

    const populatedTask = await CollectionTask.findById(task._id)
      .populate('workerId', 'name email phone')
      .populate('binId', 'binId location area wasteLevel');

    // Send notification to worker
    await Notification.create({
      recipientId: workerId,
      message: `A new waste collection task ${taskId} has been assigned to you.`,
      type: 'task',
    });

    // Log action
    await logActivity('TASK_CREATED', 'CollectionTask', task._id, req.user?._id, `Assigned task ${task.taskId} to worker ${workerId}`);

    res.status(201).json({ message: 'Task created successfully', task: populatedTask });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Get all collection tasks
 * GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    const tasks = await CollectionTask.find()
      .populate('workerId', 'name email phone')
      .populate('binId', 'binId location area wasteLevel');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a collection task by ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const task = await CollectionTask.findById(req.params.id)
      .populate('workerId', 'name email phone')
      .populate('binId', 'binId location area wasteLevel');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Update a collection task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const taskBefore = await CollectionTask.findById(req.params.id);
    if (!taskBefore) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = await CollectionTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('workerId', 'name email phone')
      .populate('binId', 'binId location area wasteLevel');

    // Log status change
    let action = 'TASK_UPDATED';
    if (req.body.status && req.body.status !== taskBefore.status) {
      if (req.body.status === 'completed') action = 'TASK_COMPLETED';
      else if (req.body.status === 'in-progress') action = 'TASK_STARTED';
      else if (req.body.status === 'cancelled') action = 'TASK_CANCELLED';
    }
    await logActivity(action, 'CollectionTask', task._id, req.user?._id, `Status updated to ${task.status} for task ${task.taskId}`);

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Delete a collection task (Admin only)
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const task = await CollectionTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await CollectionTask.findByIdAndDelete(req.params.id);

    // Log deletion
    await logActivity('TASK_DELETED', 'CollectionTask', task._id, req.user?._id, `Deleted task ${task.taskId}`);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
