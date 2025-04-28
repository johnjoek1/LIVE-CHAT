//authRoutes
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const { getUsers, deleteUser } = require('../Controllers/userController');
const { protect: authMiddleware, admin: adminMiddleware } = require('../Middlewares/authMiddleware'); // Fixed import
const moderatorMiddleware = require('../Middlewares/moderatorMiddleware');

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { username, email, password, preferredLanguage } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) { 
    return res.status(400).json({ error: 'Username or email already taken' });
  }
  const newUser = new User({
    username,
    email,
    password,
    preferredLanguage: preferredLanguage || 'en',
  });
  await newUser.save();
  res.status(201).json({ 
    message: 'User registered successfully',
    user: { id: newUser._id, username: newUser.username, email: newUser.email }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user._id, preferredLanguage: user.preferredLanguage },
    process.env.JWT_SECRET || "John_Paul_1234",
    { expiresIn: '1h' }
  );
  res.json({ 
    token,
    user: { id: user._id, username: user.username }
  });
}));

/**
 * @route   GET /api/auth/moderate
 * @desc    Get users for moderation (Moderator-only)
 * @access  Private (Moderator)
 */
console.log('getUsers type:', typeof getUsers, getUsers);
router.get('/moderate', (req, res, next) => {
  authMiddleware(req, res, () => {
    moderatorMiddleware(req, res, () => {
      getUsers(req, res, next);
    });
  });
});

/** 
 * @route   DELETE /api/auth/:id
 * @desc    Delete a user (Admin-only)
 * @access  Private (Admin)
 */
console.log('deleteUser type:', typeof deleteUser, deleteUser);
router.delete('/:id', (req, res, next) => {
  authMiddleware(req, res, () => {
    adminMiddleware(req, res, () => {
      deleteUser(req, res, next);
    });
  });
});

module.exports = router;