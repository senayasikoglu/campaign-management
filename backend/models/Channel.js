const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'passive'],
    default: "active",
    lowercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Channel', channelSchema); 