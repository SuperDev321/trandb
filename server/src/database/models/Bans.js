const { Schema, model } = require('mongoose');

const banSchema = new Schema({
  username: { type: String },
  room: { type: String },
  type: String,
  ip: { type: Number },
  fromIp: Number,
  toIp: Number,
  reason: String
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});
banSchema.index({username: 1, room: 1, ip: 1});
const Bans = model('Bans', banSchema);

module.exports = Bans;
