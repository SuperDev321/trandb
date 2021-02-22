const { Schema, model } = require('mongoose');

const blockSchema = new Schema({
  username: { type: String, required: true },
  room: { type: String},
  type: {type: String, required: true},
  ip: Number,
});

const Blocks = model('Blocks', blockSchema);

module.exports = Blocks;
