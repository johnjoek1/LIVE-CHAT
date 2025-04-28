
//userRoutes
const express = require('express');
const router = express.Router();

const {
  getUsers,  // Corrected from getAllUsers to match userController.js
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
} = require('../Controllers/userController');

const { protect, admin } = require('../Middlewares/authMiddleware');

// Debug logging to verify imports
console.log('userRoutes imports:');
console.log('getUsers:', typeof getUsers, getUsers);
console.log('getUserProfile:', typeof getUserProfile, getUserProfile);
console.log('getUserById:', typeof getUserById, getUserById);
console.log('updateUserProfile:', typeof updateUserProfile, updateUserProfile);
console.log('deleteUser:', typeof deleteUser, deleteUser);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', protect, admin, getUsers);

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get('/profile', protect, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, updateUserProfile);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, admin, getUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;





























