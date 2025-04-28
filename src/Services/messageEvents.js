//messageEvents

const Message = require('../Models/Message');
const { translate } = require('../Services/translationService');

/**
 * Registers Socket.IO event handlers for messaging functionality
 * @param {Server} io - Socket.IO server instance
 */
const registerMessageEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    /**
     * Handle sending a new message
     */
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, originalText, targetLanguage } = data;

        if (!sender || !receiver || !originalText) {
          throw new Error('Missing required fields: sender, receiver, or originalText');
        }

        let translatedText = null;
        let detectedLanguage = null;

        // Translate message if target language is specified
        if (targetLanguage) {
          const { translatedText: translated, detectedLanguage: detected } = await translate(originalText, targetLanguage);
          translatedText = translated;
          detectedLanguage = detected;
        }

        const message = await Message.create({
          sender,
          receiver,
          originalText,
          translatedText,
          detectedLanguage,
          targetLanguage,
          timestamp: new Date(),
          read: false,
          reactions: [],
          attachments: [],
          edited: false,
          deleted: false,
        });

        io.to(receiver).emit('newMessage', message);
      } catch (error) {
        console.error('Error sending message:', error.message);
        socket.emit('error', { message: 'Failed to send message', error: error.message });
      }
    });

    /**
     * Handle reacting to a message
     */
    socket.on('reactToMessage', async ({ messageId, reactionType, userId }) => {
      try {
        if (!messageId || !reactionType || !userId) {
          throw new Error('Missing required fields: messageId, reactionType, or userId');
        }

        const message = await Message.findById(messageId);
        if (!message || message.deleted) {
          throw new Error('Message not found or deleted');
        }

        const existingReaction = message.reactions.find(
          (r) => r.userId.toString() === userId && r.reactionType === reactionType
        );

        if (!existingReaction) {
          message.reactions.push({ userId, reactionType });
          await message.save();
          io.emit('messageUpdated', message);
        }
      } catch (error) {
        console.error('Error reacting to message:', error.message);
        socket.emit('error', { message: 'Failed to react to message', error: error.message });
      }
    });

    /**
     * Handle editing a message
     */
    socket.on('editMessage', async ({ messageId, newText }) => {
      try {
        if (!messageId || !newText) {
          throw new Error('Missing required fields: messageId or newText');
        }

        const message = await Message.findById(messageId);
        if (!message || message.deleted) {
          throw new Error('Message not found or deleted');
        }

        message.originalText = newText;
        message.edited = true;
        await message.save();

        io.emit('messageUpdated', message);
      } catch (error) {
        console.error('Error editing message:', error.message);
        socket.emit('error', { message: 'Failed to edit message', error: error.message });
      }
    });

    /**
     * Handle deleting a message
     */
    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        if (!messageId) {
          throw new Error('Missing required field: messageId');
        }

        const message = await Message.findById(messageId);
        if (!message) {
          throw new Error('Message not found');
        }

        message.deleted = true;
        message.originalText = 'This message was deleted';
        await message.save();

        io.emit('messageUpdated', message);
      } catch (error) {
        console.error('Error deleting message:', error.message);
        socket.emit('error', { message: 'Failed to delete message', error: error.message });
      }
    });

    /**
     * Handle user disconnection
     */
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

module.exports = registerMessageEvents;

