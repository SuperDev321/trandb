const { Rooms } = require('../../database/models');

const createPrivateRoom = async (from, to) => {
  let roomName = null;
  if (from > to) {
    roomName = `${to}-${from}`
  } else {
    roomName = `${from}-${to}`
  }
  const oldRoom = await Rooms.findOne({name: roomName, type: 'private'})
  if (!oldRoom) {
    Rooms.create({name: roomName, type: 'private'});
    return true
  } else {
    await Rooms.updateOne({name: roomName}, {type: 'private'});
    return false
  }
  
};

module.exports = createPrivateRoom;
