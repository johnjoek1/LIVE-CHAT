const io = require('socket.io-client');
const socket = io('http://localhost:5055', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGUyMWM1NDY2ODVhMWQyZGE3YTg3ZiIsInByZWZlcnJlZExhbmd1YWdlIjoiZW4iLCJpYXQiOjE3NDU3NTg2NTMsImV4cCI6MTc0NTc2MjI1M30.g2Gho3eA-MFT4_aKqUzgrL8i2aqkulIBilBrDVh7qL8' // Replace with token from login
  }
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});

socket.on('message:reacted', (data) => {
  console.log('Message reacted:', data);
});

socket.on('message:edited', (data) => {
  console.log('Message edited:', data);
});

socket.on('message:deleted', (data) => {
  console.log('Message deleted:', data);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});