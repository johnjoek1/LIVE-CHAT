//  messageController.js 

const asyncHandler = require('express-async-handler');
const Message = require('../Models/Message');
const User = require('../Models/User');
const logger = require('../Utils/logger');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user._id;

  // Validate input
  if (!recipientId || !content) {
    logger.error('Missing recipientId or content', { recipientId, content });
    res.status(400);
    throw new Error('Recipient ID and content are required');
  }

  // Verify recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    logger.error('Recipient not found', { recipientId });
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Create message
  const message = new Message({
    senderId,
    recipientId,
    content
  });

  // Save message
  await message.save();
  logger.info('Message sent successfully', { messageId: message._id, senderId, recipientId });

  // Emit Socket.IO event (if applicable)
  const io = req.app.get('io');
  if (io) {
    io.to(recipientId.toString()).emit('message', message);
    io.to(senderId.toString()).emit('message', message);
  }

  res.status(201).json(message);
});

// @desc    Get messages for a user
// @route   GET /api/messages/:userId
// @access  Private
const getMessageById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const messages = await Message.find({
    $or: [{ senderId: userId }, { recipientId: userId }]
  }).populate('senderId recipientId', 'username');
  res.status(200).json(messages);
});

// @desc    React to a message
// @route   POST /api/messages/:messageId/reactions
// @access  Private
const reactToMessage = asyncHandler(async (req, res) => {
  const { reaction } = req.body;
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  message.reactions.push({ userId, reaction });
  await message.save();

  const io = req.app.get('io');
  if (io) {
    io.to(message.senderId.toString()).emit('message:reacted', { messageId, userId, reaction });
    io.to(message.recipientId.toString()).emit('message:reacted', { messageId, userId, reaction });
  }

  res.status(200).json(message);
});

// @desc    Edit a message
// @route   PUT /api/messages/:messageId
// @access  Private
const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.senderId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this message');
  }

  message.content = content;
  message.updatedAt = Date.now();
  await message.save();

  const io = req.app.get('io');
  if (io) {
    io.to(message.senderId.toString()).emit('message:edited', { messageId, content });
    io.to(message.recipientId.toString()).emit('message:edited', { messageId, content });
  }

  res.status(200).json(message);
});

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.senderId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }

  await message.deleteOne();

  const io = req.app.get('io');
  if (io) {
    io.to(message.senderId.toString()).emit('message:deleted', { messageId });
    io.to(message.recipientId.toString()).emit('message:deleted', { messageId });
  }

  res.status(200).json({ message: 'Message deleted successfully' });
});

module.exports = {
  sendMessage,
  getMessageById,
  reactToMessage,
  editMessage,
  deleteMessage
};



























































/** 
const Message = require('../Models/Message');
const asyncHandler = require('express-async-handler');
///const cloudStorageService = require('../Services/cloudstorage');
const { ErrorResponse } = require('../Middlewares/errorHandler');

/** 
 * @desc    Get a message by ID
 * @access  Private
 */

/** 
const getMessageById = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse('Message not found', 404));
  }

  if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this message', 403));
  }

  res.status(200).json(message);
});
**/

/*
 * @desc    Send a new message
 * @access  Private
 */
///const sendMessage = asyncHandler(async (req, res) => {
  ///const { receiver, originalText, translatedText, detectedLanguage, targetLanguage, attachments } = req.body;

  /**if (!receiver || !originalText) {
   throw new Error('Receiver and originalText are required');
  }

  /**const message = new Message({
    sender: req.user._id,
    receiver,
    originalText,
    translatedText: translatedText || null,
    detectedLanguage: detectedLanguage || null,
    targetLanguage: targetLanguage || null,
    attachments: attachments || [],
  });

  const savedMessage = await message.save();

  // Emit using io from req.io (set by middleware)
  if (req.io) {
    req.io.to(receiver).emit('newMessage', savedMessage);
  }

  res.status(201).json(savedMessage);
});

/*
 * @desc    React to a message
 * @access  Private
 */
/**const reactToMessage = asyncHandler(async (req, res) => {
  const { messageId, reactionType } = req.body;

  if (!messageId || !reactionType) {
    throw new Error('messageId and reactionType are required');
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error('Message not found');
  }

  const reaction = { userId: req.user._id, reactionType };
  message.reactions.push(reaction);
  await message.save();

  // Emit using io from req.io
  if (req.io) {
    req.io.to(message.receiver.toString()).emit('messageReaction', { messageId, reaction });
  }

  res.status(200).json({ success: true, message });
});

/*
 * @desc    Edit a message
 * @access  Private
 */
/** 
const editMessage = asyncHandler(async (req, res) => {
  const { messageId, newText } = req.body;

  if (!messageId || !newText) {
    throw new Error('messageId and newText are required');
  }

  const message = await Message.findById(messageId);
  if (!message || message.sender.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to edit this message');
  }

  message.originalText = newText;
  message.edited = true;
  await message.save();

  // Emit using io from req.io
  if (req.io) {
    req.io.to(message.receiver.toString()).emit('messageEdited', message);
  }

  res.status(200).json({ success: true, message });
});

/*
 * @desc    Delete a message
 * @access  Private
 */

/** 
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  if (!messageId) {
    throw new Error('messageId is required');
  }

  const message = await Message.findById(messageId);
  if (!message || message.sender.toString() !== req.user._id.toString()) {
    throw new Error('Not authorized to delete this message');
  }

  message.deleted = true;
  await message.save();

  // Emit using io from req.io
  if (req.io) {
    req.io.to(message.receiver.toString()).emit('messageDeleted', messageId);
  }

  res.status(200).json({ success: true, message });
});

/*
 * @desc    Upload a file for a message
 * @access  Private
 */

/** 
const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const fileUrl = await cloudStorageService.uploadFile(file);
  res.status(200).json({ url: fileUrl });
});

module.exports = {
  getMessageById,
  sendMessage,
  reactToMessage,
  editMessage,
  deleteMessage,
  uploadFile,
};

**/ 
