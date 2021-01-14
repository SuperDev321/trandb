const { Schema, model } = require('mongoose');
const { boolean } = require('yup');

const chatSchema = new Schema({
  msg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
  },
  room: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  bold: {
    type: Boolean
  },
  date: {
    type: Date,
    required: true,
  },
});

const Chats = model('Chats', chatSchema);

module.exports = Chats;
