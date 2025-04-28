//  Contact.js 

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contacts: [
      {
        contactId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: {
          type: String,
        },
        lastInteraction: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
