const getRooms = require('./getRooms');
const getRoomsAdmin = require('./getRoomsAdmin');
const addRoom = require('./createRoom');
const getRoomDetail = require('./getRoomDetail');
const getUserRooms = require('./getUserRooms');
const addModerator = require('./addModerator');
const deleteModerator = require('./deleteModerator');
const {updateRoomGeneral, updateRoomMedia} = require('./updateRoom');

module.exports = {
  getRooms,
  getRoomsAdmin,
  addRoom,
  getRoomDetail,
  getUserRooms,
  addModerator,
  deleteModerator,
  updateRoomGeneral,
  updateRoomMedia
};
