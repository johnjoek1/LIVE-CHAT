//moderatorMiddleware

/**
 * @desc    Middleware to restrict access to moderators or admins
 * @access  Private (Moderator/Admin)
 */
const moderatorMiddleware = (req, res, next) => {
    if (!req.user || (req.user.role !== 'moderator' && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized, moderator or admin access required' });
    }
    next();
  };
  
  module.exports = moderatorMiddleware;
  