const { Rooms, Users } = require('../../database/models');

const getRoomPermission = async (room, userId) => {

    const user = await Users.findOne({_id: userId});
    if(user && (user.role === 'admin'|| user.role === 'super_admin')) {
        return 'admin';
    }
    const roomObject = await Rooms.findOne({ name: room });
    if(roomObject) {
        if(roomObject.owner.equals(userId)) {
            return 'owner';
        } else if(roomObject.moderators.includes(userId)) {
            return 'moderator';
        }
    } else {
        return null;
    }
    
    console.log(user)
    return user;
};

module.exports = getRoomPermission;