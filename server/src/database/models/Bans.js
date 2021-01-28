const { Schema, model } = require('mongoose');

const banSchema = new Schema({
  username: { type: String },
  room: { type: String},
  type: String,
  ip: Number,
  fromIp: Number,
  toIp: Number,
});

const Bans = model('Bans', banSchema);

module.exports = Bans;
