const { Schema, model } = require('mongoose');

const blockSchema = new Schema({
  username: { type: String },
  room: { type: String},
  type: String,
  ip: Number,
});

const Blocks = model('Blocks', blockSchema);

module.exports = Blocks;
