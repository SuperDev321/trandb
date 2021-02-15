const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  theme: {
    type: String,
    required: true,
  },
  messageNum: {
    type: Number,
    required: true,
  }
});

const Users = model('Users', userSchema);

module.exports = Users;
