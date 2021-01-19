const signup = require('./signup');
const login = require('./login');
const guestLogin = require('./guestLogin');
const googleLogin = require('./googleLogin');
const checkToken = require('./checkToken');
const logout = require('./logout');
const getUser = require('./getUser');
module.exports = {
  signup,
  login,
  guestLogin,
  googleLogin,
  checkToken,
  logout,
  getUser
};
