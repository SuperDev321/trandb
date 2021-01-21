const { Rooms } = require('../../database/models');
const createError = require('../createError');

const createRoom = async (room, userRole) => {
  if (userRole !== 'admin' && userRole !== 'user') {
    throw createError(
      403,
      'Forbidden',
      'Guest is not allowed to create new rooms.'
    );
  }

  return Rooms.create(room);
};

module.exports = createRoom;
