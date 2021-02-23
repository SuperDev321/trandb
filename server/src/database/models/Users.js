const { Schema, model } = require('mongoose');
const { boolean } = require('yup');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
    required: true
  },
  password: String,
  role: String,
  ip: String,
  isInChat: Boolean,
  created_at: Date
});

const Users = model('Users', userSchema);

module.exports = Users;
