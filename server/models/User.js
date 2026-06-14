const mongoose = require('mongoose');

/**
 * User Schema
 * Represents all users in the system: Admin, Waste Worker, and Citizen.
 * The 'role' field determines access level and dashboard view.
 *
 * DBMS Constraints:
 * - name: required
 * - email: required, unique, valid format
 * - password: required, min 6 chars
 * - role: enum (admin, worker, citizen)
 * - phone: validated format
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'worker', 'citizen'],
        message: 'Role must be one of: admin, worker, citizen',
      },
      default: 'citizen',
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || v === '') return true; // optional field
          return /^[+]?[\d\s\-()]{7,20}$/.test(v);
        },
        message: 'Phone number format is invalid. Use digits, spaces, dashes, or start with +',
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Custom error message for duplicate email
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists. Please use a different email address.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
