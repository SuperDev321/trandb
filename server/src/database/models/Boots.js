const { Schema, model } = require('mongoose');

const bootSchema = new Schema({
  content: { type: String , required: true},
  active: {type: Boolean, required: true},
  color: {
    type: String,
  },
  bold: {
    type: Boolean
  },
  size: {
    type: Number
  }
});

const Boots = model('Boots', bootSchema);

module.exports = Boots;