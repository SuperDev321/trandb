const { Rooms, Users } = require('../../database/models');

const initRooms = async () => {
    await Rooms.updateMany({}, {'$set': {users: []}});
    await Users.updateMany({}, {'$set': {isInChat: false}})
}

module.exports = initRooms;