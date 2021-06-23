const { Schema, model } = require('mongoose');

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
  avatarObj: {
    default: String,
    joomula: String,
  },
  currentAvatar: String,
  password: String,
  aboutMe: String,    
  role: String,
  ip: String,
  isInChat: Boolean,
  isMobile: Boolean,
  avatar: String,
  created_at: Date,
  point: Number
});

const Users = model('Users', userSchema);

module.exports = Users;
