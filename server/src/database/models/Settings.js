const { Schema, model } = require('mongoose');

const settingSchema = new Schema({
  type: String,
  theme: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  messageNum: {
    type: Number,
    required: true,
  }
});

const Settings = model('Settings', settingSchema);

module.exports = Settings;
