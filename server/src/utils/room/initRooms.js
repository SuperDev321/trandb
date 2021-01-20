const { Rooms } = require('../../database/models');

const initRooms = async () => {
    console.log('init rooms');
    await Rooms.updateMany({}, {'$set': {users: []}});
}

module.exports = initRooms;