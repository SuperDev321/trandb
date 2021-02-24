const { Rooms, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');

const disconnectSocket = async (io, socket) => {
    const rooms = [...socket.rooms];
    // socket.rooms returns an object where key and value are the same
    // first key is socket id, second key is rooms name
    const { _id } = socket.decoded;
    await Users.updateOne({_id}, {isInChat: false});
    for (let index = 0; index < rooms.length; index++) {
        const room = rooms[index];
        if(room) {
            await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
            const usersInfo = await findRoomUsers(room);
            io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
            console.log('disconnect event', _id)
        }
    }
}

const socketDisconnect = (io, socket) => async (reason) => {
    try {
        if(reason === 'ping timeout') {
            let state = false;
            socket.emit('hey', null, (response) => {
                console.log('hey response', response)
                if(response) {
                    state = true;
                }
            });
            setTimeout(() => {
                if(!state) {
                    disconnectSocket(io, socket);
                }
            }, 3000)
        }
        // if(reason === 'client namespace disconnect' || reason === 'transport error' || reason === 'transport close') {
            disconnectSocket(io, socket);
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
