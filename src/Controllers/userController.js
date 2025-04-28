//userController
const User = require('../Models/User');
const asyncHandler = require('express-async-handler');
const { ErrorResponse } = require('../Middlewares/errorHandler');

/**
 * @desc    Get all users (excluding passwords)
 * @access  Private (Moderator/Admin)
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

/**
 * @desc    Get current user's profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
    role: user.role
  });
});

/**
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
    role: user.role
  });
});

/**
 * @desc    Update user profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields if provided
  user.username = req.body.username || user.username;
  user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;
  
  if (req.body.password) {
    user.password = req.body.password; // Will be hashed by pre-save hook
  }

  const updatedUser = await user.save();
  
  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    preferredLanguage: updatedUser.preferredLanguage,
    role: updatedUser.role
  });
});

/**
 * @desc    Delete user by ID
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  await user.deleteOne();
  res.status(200).json({ 
    message: 'User successfully removed',
    userId: req.params.id 
  });
});

module.exports = {
  getUsers,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
};