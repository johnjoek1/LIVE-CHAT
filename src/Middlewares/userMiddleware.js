//userMiddleware

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

/**
 * @desc    Middleware to verify a regular user
 * @access  Private (User)
 */
const userMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    res.status(403);
    throw new Error('Access denied: Users only');
  }
  next();
});

module.exports = userMiddleware;

