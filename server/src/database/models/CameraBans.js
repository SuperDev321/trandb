const { Schema, model } = require('mongoose');

const banSchema = new Schema({
  username: { type: String },
  room: { type: String },
  type: String,
  ip: Number,
  fromIp: Number,
  toIp: Number,
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

const CameraBans = model('CameraBans', banSchema);

module.exports = CameraBans;
