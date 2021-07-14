const { Rooms, Users } = require('../../database/models');

const initRooms = async () => {
    await Rooms.updateMany({ type: { $ne: 'private' } }, {'$set': {users: []}});
    await Users.updateMany({}, {'$set': {isInChat: false}})
}

module.exports = initRooms;