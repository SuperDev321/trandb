const signup = require('./signup');
const login = require('./login');
const guestLogin = require('./guestLogin');
const googleLogin = require('./googleLogin');
const checkToken = require('./checkToken');
const logout = require('./logout');
const getUserByName = require('./getUserByName');
const getUserDetail = require('./getUserDetail');
const getUsers = require('./getUsers');
const updateProfile = require('./updateProfile');
const updateAvatar = require('./updateAvatar');
const initPoints = require('./initPoints');
const updatePoint = require('./updatePoint');
module.exports = {
  signup,
  login,
  guestLogin,
  googleLogin,
  checkToken,
  logout,
  getUserByName,
  getUserDetail,
  getUsers,
  updateProfile,
  updateAvatar,
  initPoints,
  updatePoint
};
