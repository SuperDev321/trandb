const { Rooms, Chats, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');

const leaveRoom = (io, socket) => async ({ room }) => {
    try {
        const { _id } = socket.decoded;
        socket.leave(room);
        console.log('leave from', room)
        let user = await Users.findOne({_id});
        console.log('leave', user)
        await Rooms.updateOne({ name: room }, { $pullAll: { users: [_id] } });
        const usersInfo = await findRoomUsers(room);
        io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: user});
    } catch (err) {
        console.log(err);
    }
};

module.exports = leaveRoom;
