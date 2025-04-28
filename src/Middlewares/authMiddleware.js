//authMiddleware

const jwt = require('jsonwebtoken');
const User = require('../Models/User');

/**
 * @desc    Middleware to protect routes by verifying JWT token
 * @access  Private
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader); // Debug log
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      console.log('Token:', token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "John_Paul_1234");
      console.log('Decoded:', decoded); // Debug log
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

/**
 * @desc    Middleware to restrict access to admin users only
 * @access  Private (Admin)
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized, admin access required' });
  }
  next();
};

module.exports = { protect, admin };
