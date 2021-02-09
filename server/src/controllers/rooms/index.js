const getRooms = require('./getRooms');
const addRoom = require('./createRoom');
const getRoomDetail = require('./getRoomDetail');
const getUserRooms = require('./getUserRooms');
const addModerator = require('./addModerator');
const deleteModerator = require('./deleteModerator');
const {updateRoomGeneral, updateRoomMedia} = require('./updateRoom');

module.exports = {
  getRooms,
  addRoom,
  getRoomDetail,
  getUserRooms,
  addModerator,
  deleteModerator,
  updateRoomGeneral,
  updateRoomMedia
};
