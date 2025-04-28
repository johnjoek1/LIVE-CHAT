const express = require('express');
const adminMiddleware = require('./middleware/adminMiddleware');

const router = express.Router();

router.get('/admin-dashboard', adminMiddleware, (req, res) => {
  res.send('Welcome to the admin dashboard');
});

module.exports = router;
