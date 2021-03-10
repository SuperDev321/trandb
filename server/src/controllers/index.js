const { clientError, serverError } = require('./errorHandlers');
const { signup, login, guestLogin, googleLogin, checkToken, logout, getUserByName, getUserDetail } = require('./users');
const { getRooms, getRoomsAdmin, addRoom, deleteRoom, getRoomDetail, getPublicRoomNames, checkRoomPermission, getUserRooms, addModerator, deleteModerator, updateRoomGeneral, updateRoomMedia } = require('./rooms');
const { getPrivateChat, fileUploader } = require('./chats');
const {addBan, deleteBan, getBans} = require('./bans');
const {getWords, addWord, deleteWord} = require('./forbiddenWords');
const {getSetting, updateSetting} = require('./settings');
const {getQuizes, addQuiz} = require('./quizes');

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
  checkRoomPermission,
  getRooms,
  getRoomsAdmin,
  addRoom,
  deleteRoom,
  updateRoomMedia,
  updateRoomGeneral,
  getRoomDetail,
  getPublicRoomNames,
  getPrivateChat,
  fileUploader,
  addBan,
  deleteBan,
  getBans,
  addModerator,
  deleteModerator,
  getUserRooms,
  // forbidden words
  getWords,
  addWord,
  deleteWord,
  // setting
  getSetting,
  updateSetting,
  // quiz
  getQuizes,
  addQuiz

};
