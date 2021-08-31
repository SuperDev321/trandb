const { Schema, model } = require('mongoose');

const blockSchema = new Schema({
  username: { type: String, required: true },
  room: { type: String},
  type: {type: String, required: true},
  ip: { type: Number },
});
blockSchema.index({username: 1, room: 1, ip: 1});
const Blocks = model('Blocks', blockSchema);

module.exports = Blocks;
