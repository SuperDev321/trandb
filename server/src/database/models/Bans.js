const { Schema, model } = require('mongoose');

const banSchema = new Schema({
  username: { type: String },
  room: { type: String},
  ip: Number,
  startIp: Number,
  endIp: Number,
});

const Bans = model('Bans', banSchema);

module.exports = Bans;
