const express = require('express');
const router = express.Router();
const { register, login, getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes — admin only
router.get('/users', auth, authorize('admin'), getUsers);
router.get('/users/:id', auth, authorize('admin'), getUserById);
router.post('/users', auth, authorize('admin'), createUser);
router.put('/users/:id', auth, authorize('admin'), updateUser);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
