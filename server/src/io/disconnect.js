const { Rooms, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');

const socketDisconnect = (io, socket) => async (reason) => {
    try {
        console.log('disconnect')
        // if(reason === 'client namespace disconnect' || reason === 'transport error' || reason === 'transport close') {
            const rooms = [...socket.rooms];
            // socket.rooms returns an object where key and value are the same
            // first key is socket id, second key is rooms name
            const { _id } = socket.decoded;
            let user = await Users.findOne({_id});
            for (let index = 2; index < rooms.length; index++) {
                const room = rooms[index];
                if(room) {
                    await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
                    const usersInfo = await findRoomUsers(room);
                    io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: user});
                }
            }
        // }
        
        // for (let index = 2; index < rooms.length; index++) {
        //     const room = rooms[index];
        //     socket.leave(room);
        // }
        
    } catch (err) {
        console.log(err);
    }
};

module.exports = socketDisconnect;
