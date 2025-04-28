// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);






















































/** 
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalText: { type: String, required: true },
    translatedText: { type: String }, // Store translated message text
    detectedLanguage: { type: String }, // Detected language of the original message
    targetLanguage: { type: String }, // User's preferred language for translation
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },

    // Reactions (Emojis & GIFs)
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reactionType: { type: String }, // e.g., "😂", "❤️", "👍"
      },
    ],

    // Attachments (Files, Images, GIFs)
    attachments: [
      {
        url: { type: String, required: true }, // URL of the file/image/GIF
        fileType: {
          type: String,
          enum: ['image', 'video', 'gif', 'document', 'audio'],
        },
      },
    ],

    // Message Editing & Deletion
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    // Message Status
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },

    // Chat type (Private or Group)
    chatType: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },

    // For Group Chats
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);

**/







