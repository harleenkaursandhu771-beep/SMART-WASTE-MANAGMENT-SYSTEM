const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Register a new user
 * POST /api/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      phone,
      address,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Login an existing user
 * POST /api/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all users (admin only)
 * GET /api/users
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get user by ID (admin only)
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Create a user (admin only)
 * POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt); // default password if none provided

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      phone: phone || '',
      address: address || '',
    });

    await logActivity('USER_CREATED', 'User', user._id, req.user?._id, `Created user ${user.name} (${user.role})`);

    const userRes = user.toObject();
    delete userRes.password;
    res.status(201).json({ message: 'User created successfully', user: userRes });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Update a user (admin only)
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    await logActivity('USER_UPDATED', 'User', updatedUser._id, req.user?._id, `Updated user ${updatedUser.name} (${updatedUser.role})`);

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Delete a user (admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    await logActivity('USER_DELETED', 'User', user._id, req.user?._id, `Deleted user ${user.name} (${user.role})`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getUsers, getUserById, createUser, updateUser, deleteUser };
