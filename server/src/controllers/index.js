const { clientError, serverError } = require('./errorHandlers');
const { signup, login, guestLogin, googleLogin, checkToken, logout, getUserByName, getUserDetail } = require('./users');
const { getRooms, addRoom, getRoomDetail, getUserRooms, addModerator, deleteModerator, updateRoomGeneral, updateRoomMedia } = require('./rooms');
const { getPrivateChat } = require('./chats');
const {addBan, deleteBan, getBans} = require('./bans')

module.exports = {
  clientError,
  serverError,
  signup,
  login,
  guestLogin,
  googleLogin,
  checkToken,
  logout,
  getUserByName,
  getUserDetail,
  getRooms,
  addRoom,
  updateRoomMedia,
  updateRoomGeneral,
  getRoomDetail,
  getPrivateChat,
  addBan,
  deleteBan,
  getBans,
  addModerator,
  deleteModerator,
  getUserRooms
};
