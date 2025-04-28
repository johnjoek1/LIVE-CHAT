//server

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const webpush = require('./src/Services/pushNotification');

const authRoutes = require('./src/Routes/authRoutes');
const userRoutes = require('./src/Routes/userRoutes');
const messageRoutes = require('./src/Routes/messageRoutes');
const notificationRoutes = require('./src/Routes/notificationRoutes');
const registerMessageEvents = require('./src/Services/messageEvents');
const { errorHandler } = require('./src/Utils/errorHandler');
const logger = require('./src/Utils/logger');
const connectDB = require('./src/utils/db');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Logger initialization
logger.info('Application has started');
logger.info('Using updated server.js version 2025-04-19');
logger.info('Restored server.js 2025-04-30');
logger.warn('This is a warning message');
try {
  // Placeholder for try/catch error simulation
} catch (err) {
  logger.error('An error occurred', { error: err });
}

// Connect to MongoDB
connectDB();

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
logger.debug('Applied cors middleware');
app.use(express.json());
logger.debug('Applied express.json middleware');
app.use((req, res, next) => {
  req.io = io; // Attach io to every request
  next();
});
logger.debug('Applied io middleware');

// Debug route imports
logger.debug('authRoutes:', { type: typeof authRoutes, value: authRoutes });
logger.debug('userRoutes:', { type: typeof userRoutes, value: userRoutes });
logger.debug('messageRoutes:', { type: typeof messageRoutes, value: messageRoutes });
logger.debug('notificationRoutes:', { type: typeof notificationRoutes, value: notificationRoutes });

// API Routes
app.use('/api/auth', authRoutes);
logger.debug('Applied authRoutes');
app.use('/api/users', userRoutes);
logger.debug('Applied userRoutes');
app.use('/api/messages', messageRoutes);
logger.debug('Applied messageRoutes');
app.use('/api/notifications', notificationRoutes);
logger.debug('Applied notificationRoutes');

// Error Handling Middleware
app.use(errorHandler);
logger.debug('Applied errorHandler middleware');

// Register WebSocket events
registerMessageEvents(io);

// Start server
const PORT = process.env.PORT || 5055;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { io };








/**
const express = require('express');
     const http = require('http');
     const dotenv = require('dotenv');
     const mongoose = require('mongoose');
     const cors = require('cors');
     const { Server } = require('socket.io');
     const cloudinary = require('./src/Config/cloudinary');
     const webpush = require('./src/Services/pushNotification');

     const authRoutes = require('./src/Routes/authRoutes');
     const userRoutes = require('./src/Routes/userRoutes');
     const messageRoutes = require('./src/Routes/messageRoutes');
     const notificationRoutes = require('./src/Routes/notificationRoutes');
     const uploadRoutes = require('./src/Routes/uploadRoutes');
     const registerMessageEvents = require('./src/Services/messageEvents');
     const { errorHandler } = require('./src/utils/errorHandler');
     const googleTranslate = require('./src/Services/googleTranslate');
     const logger = require('./src/utils/logger');
     const connectDB = require('./src/utils/db');

     // Load environment variables
     dotenv.config();

     // Initialize Express app and HTTP server
     const app = express();
     const server = http.createServer(app);

     // Logger initialization
     logger.info('Application has started');
     logger.info('Using updated server.js version 2025-04-19');
     logger.info('Restored server.js 2025-04-29');
     logger.warn('This is a warning message');
     try {
       // Placeholder for try/catch error simulation
     } catch (err) {
       logger.error('An error occurred', { error: err });
     }

     // Test translation on startup
     (async () => {
       try {
         const translated = await googleTranslate('Bonjour', 'en');
         logger.info('Translation Example:', { translated });
       } catch (err) {
         logger.error('Error in test translation:', { error: err });
       }
     })();

     // Connect to MongoDB
     connectDB();

     // Setup Socket.IO
     const io = new Server(server, {
       cors: {
         origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
         methods: ['GET', 'POST', 'PUT', 'DELETE'],
       },
     });

     // Middleware
     app.use(cors());
     logger.debug('Applied cors middleware');
     app.use(express.json());
     logger.debug('Applied express.json middleware');
     app.use((req, res, next) => {
       req.io = io; // Attach io to every request
       next();
     });
     logger.debug('Applied io middleware');

     // Debug route imports
     logger.debug('authRoutes:', { type: typeof authRoutes, value: authRoutes });
     logger.debug('userRoutes:', { type: typeof userRoutes, value: userRoutes });
     logger.debug('messageRoutes:', { type: typeof messageRoutes, value: messageRoutes });
     logger.debug('notificationRoutes:', { type: typeof notificationRoutes, value: notificationRoutes });
     logger.debug('uploadRoutes:', { type: typeof uploadRoutes, value: uploadRoutes });

     // API Routes
     app.use('/api/auth', authRoutes);
     logger.debug('Applied authRoutes');
     app.use('/api/users', userRoutes);
     logger.debug('Applied userRoutes');
     app.use('/api/messages', messageRoutes);
     logger.debug('Applied messageRoutes');
     app.use('/api/notifications', notificationRoutes);
     logger.debug('Applied notificationRoutes');
     app.use('/api/uploads', uploadRoutes);
     logger.debug('Applied uploadRoutes');

     // Error Handling Middleware
     app.use(errorHandler);
     logger.debug('Applied errorHandler middleware');

     // Register WebSocket events
     registerMessageEvents(io);

     // Start server
     const PORT = process.env.PORT || 5055;
     server.listen(PORT, () => {
       logger.info(`Server running on port ${PORT}`);
     });

     module.exports = { io };
**/
























