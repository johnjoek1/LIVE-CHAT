// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getMessageById, 
  reactToMessage, 
  editMessage, 
  deleteMessage 
} = require('../Controllers/messageController');
const { protect } = require('../Middlewares/authMiddleware');

// Debug logging to verify imports
console.log('messageRoutes imports:');
console.log('sendMessage:', typeof sendMessage, sendMessage);
console.log('getMessageById:', typeof getMessageById, getMessageById);
console.log('reactToMessage:', typeof reactToMessage, reactToMessage);
console.log('editMessage:', typeof editMessage, editMessage);
console.log('deleteMessage:', typeof deleteMessage, deleteMessage);

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post('/', protect, sendMessage);

/**
 * @route   GET /api/messages/:userId
 * @desc    Get all messages for a user
 * @access  Private
 */
router.get('/:userId', protect, getMessageById);

/**
 * @route   POST /api/messages/:messageId/reactions
 * @desc    React to a message
 * @access  Private
 */
router.post('/:messageId/reactions', protect, reactToMessage);

/**
 * @route   PUT /api/messages/:messageId
 * @desc    Edit a message
 * @access  Private
 */
router.put('/:messageId', protect, editMessage);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/:messageId', protect, deleteMessage);

module.exports = router;