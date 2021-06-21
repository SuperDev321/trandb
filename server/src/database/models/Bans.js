const { Schema, model } = require('mongoose');

const banSchema = new Schema({
  username: { type: String },
  room: { type: String},
  type: String,
  ip: Number,
  fromIp: Number,
  toIp: Number,
  reason: String
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

const Bans = model('Bans', banSchema);

module.exports = Bans;
