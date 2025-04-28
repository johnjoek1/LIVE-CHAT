const Notification = require('../Models/Notification');
const asyncHandler = require('express-async-handler');
const { ErrorResponse } = require('../Middlewares/errorHandler');
const { validationResult } = require('express-validator');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    message: 'Notifications retrieved successfully',
    data: notifications,
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }

  await notification.remove();

  res.status(200).json({
    status: 'success',
    message: 'Notification deleted successfully',
  });
});

// @desc    Create a new notification (for testing purposes)
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res, next) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Invalid input data', 400));
  }

  const { message } = req.body;

  const notification = new Notification({
    user: req.user.id,
    message,
  });

  await notification.save();

  res.status(201).json({
    status: 'success',
    message: 'Notification created successfully',
    data: notification,
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
};
