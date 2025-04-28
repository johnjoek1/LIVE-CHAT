const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
} = require('../Controllers/notificationController');
const { protect } = require('../Middlewares/authMiddleware');

// GET /api/notifications - Get all notifications for logged-in user
router.get('/', protect, getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', protect, markAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', protect, deleteNotification);

// POST /api/notifications - Create new notification with validation
router.post(
  '/',
  protect,
  [
    body('recipient').isMongoId().withMessage('Invalid recipient ID'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type')
      .isIn(['message', 'comment', 'like', 'follow', 'system'])
      .withMessage('Invalid notification type'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed to the controller
    createNotification(req, res, next);
  }
);

module.exports = router;










