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
  messageType: {
    type: String,
  },
  from: {
    type: String,
    required: true,
  },
  ip: String,
  to: {
    type: String,
  },
  room: {
    type: String,
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

chatSchema.index({type: 1, room: 1, from: 1, to: 1, date: 1});

const Chats = model('Chats', chatSchema);

module.exports = Chats;
