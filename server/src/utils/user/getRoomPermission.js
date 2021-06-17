const { Rooms, Users } = require('../../database/models');

const getRoomPermission = async (room, userId) => {

    const user = await Users.findOne({_id: userId});
    if(user && (user.role === 'admin'|| user.role === 'super_admin')) {
        return { username: user.username, role: 'admin'}
    }
    const roomObject = await Rooms.findOne({ name: room });
    if(roomObject) {
        if(roomObject.owner.equals(userId)) {
            return { username: user.username, role: 'owner'};
        } else if(roomObject.moderators.includes(userId)) {
            return { username: user.username, role: 'moderator'};
        }
    } else {
        return null;
    }
    return { username: user.username, role: 'normal'};
};

module.exports = getRoomPermission;