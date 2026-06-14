const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('admin'), createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, authorize('admin'), deleteTask);

module.exports = router;
