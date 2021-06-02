const getRooms = require('./getRooms');
const getRoomsAdmin = require('./getRoomsAdmin');
const addRoom = require('./createRoom');
const deleteRoom = require('./deleteRoom');
const getRoomDetail = require('./getRoomDetail');
const getPublicRoomNames = require('./getPublicRoomNames');
const getPrivateRoomNames = require('./getPrivateRoomNames');
const checkRoomPermission = require('./checkRoomPermission');
const getUserRooms = require('./getUserRooms');
const addModerator = require('./addModerator');
const deleteModerator = require('./deleteModerator');
const {updateRoomGeneral, updateRoomMedia} = require('./updateRoom');

module.exports = {
  getRooms,
  getRoomsAdmin,
  addRoom,
  getRoomDetail,
  checkRoomPermission,
  getUserRooms,
  addModerator,
  deleteModerator,
  updateRoomGeneral,
  updateRoomMedia,
  deleteRoom,
  getPublicRoomNames,
  getPrivateRoomNames
};
