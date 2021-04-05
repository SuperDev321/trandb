const { Rooms } = require('../../database/models');
const createError = require('../createError');

const createRoom = async (room, userRole) => {
  console.log('create room', room)
  if (userRole !== 'super_admin' && userRole !== 'admin' && userRole !== 'user') {
    throw createError(
      403,
      'Forbidden',
      'Guest is not allowed to create new rooms.'
    );
  }

  return Rooms.create(room);
};

module.exports = createRoom;
