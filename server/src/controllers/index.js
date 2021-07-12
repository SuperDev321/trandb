const { clientError, serverError } = require('./errorHandlers');
const { signup, login, guestLogin, googleLogin, checkToken,
  logout, getUserByName, getUserDetail, getUsers, updateProfile, updateAvatar,
  initPoints, updatePoint
} = require('./users');
const { getRooms, getRoomsAdmin, addRoom, deleteRoom, getRoomDetail, getPublicRoomNames, getPrivateRoomNames,
  checkRoomPermission, getUserRooms, addModerator, deleteModerator, updateRoomGeneral, updateRoomMedia } = require('./rooms');
const { getPrivateChat, getPublicChat, fileUploader, deleteChat } = require('./chats');
const {addBan, deleteBan, getBans} = require('./bans');
const {getWords, addWord, deleteWord} = require('./forbiddenWords');
const {getSetting, updateSetting} = require('./settings');
const {startBoot, deleteBoot, addBoot, getBoots, stopBoot, editBoot} = require('./boots');
const { getGifts, addGift, deleteGift, updateGift } = require('./gifts');
const { getStatus: getPointBotStatus, startPointBot, stopPointBot} = require('./points');

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
  getUsers,
  updateProfile,
  updatePoint,
  updateAvatar,
  checkRoomPermission,
  initPoints,
  getRooms,
  getRoomsAdmin,
  addRoom,
  deleteRoom,
  updateRoomMedia,
  updateRoomGeneral,
  getRoomDetail,
  getPublicRoomNames,
  getPrivateRoomNames,
  getPrivateChat,
  getPublicChat,
  deleteChat,
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
  startBoot,
  deleteBoot,
  addBoot,
  editBoot,
  getBoots,
  stopBoot,
  // gift
  addGift,
  deleteGift,
  updateGift,
  getGifts,
  getPointBotStatus,
  startPointBot,
  stopPointBot
};
