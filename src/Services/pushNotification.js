//pushNotification

const webpush = require('web-push');
require('dotenv').config();

webpush.setVapidDetails(
  'mailto:johnpromise1153@gmail.com', // Replace with your email
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
