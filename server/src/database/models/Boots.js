const { Schema, model } = require('mongoose');

const bootSchema = new Schema({
  content: { type: String , required: true},
});

const Boots = model('Boots', bootSchema);

module.exports = Boots;