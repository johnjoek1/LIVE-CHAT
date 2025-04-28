const express = require('express');
const moderatorMiddleware = require('./middleware/moderatorMiddleware');

const router = express.Router();

router.get('/moderator-dashboard', moderatorMiddleware, (req, res) => {
  res.send('Welcome to the moderator dashboard');
});

module.exports = router;
