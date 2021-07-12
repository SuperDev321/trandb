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
  },
  allowPrivate: {
    type: Boolean,
    required: true
  },
  messageTimeInterval: {
    type: Number,
  },
  maxUsernameLength: {
    type: Number
  },
  maxMessageLength: {
    type: Number
  },
  avatarOption: {
    type: Boolean
  },
  allowGuestAvatarUpload: Boolean,
  avatarColor: {
    type: Boolean
  },
  bypassBan: Boolean,
  showGiftMessage: Boolean,
  showGift: Boolean,
  pointOption: Boolean
});

const Settings = model('Settings', settingSchema);

module.exports = Settings;
