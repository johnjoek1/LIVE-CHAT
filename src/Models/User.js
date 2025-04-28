// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Consistent with your import

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true, // Remove leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true, // Normalize emails to lowercase
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'], // Basic validation
    },
    profileImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'es', 'fr'],
      default: 'en',
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries on username and email
userSchema.index({ username: 1, email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Skip if password isn’t modified
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);














