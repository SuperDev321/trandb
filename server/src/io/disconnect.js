const { Rooms, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');
const LogManager = require('../constructors/logManager');
const ipInt = require('ip-to-int');
const disconnectSocket = async (io, socket) => {
    const rooms = [...socket.rooms];
    
    // socket.rooms returns an object where key and value are the same
    // first key is socket id, second key is rooms name
    const { _id } = socket.decoded;
    let user = await Users.findOne({_id});
    if(user) {
        await Users.updateOne({_id}, {isInChat: false});
    }
    let user1 = await Users.findOne({_id});
    for (let index = 0; index < rooms.length; index++) {
        const room = rooms[index];
        if(room) {
            await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
            const usersInfo = await findRoomUsers(room);
            socket.leave(room);
            io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
        }
    }
    LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect');
}

const socketDisconnect = (io, socket) => async (reason) => {
    try {
        // console.log(reason)
        // if(reason === 'ping timeout') {
        //     let state = false;
        //     socket.emit('hey', null, (response) => {
        //         console.log('hey response', response)
        //         if(response) {
        //             state = true;
        //         }
        //     });
        //     setTimeout(() => {
        //         console.log('ping timeout state', state)
        //         if(!state) {
        //             disconnectSocket(io, socket);
        //         }
        //     }, 1000)
        // } else {
            disconnectSocket(io, socket);
        // }
        // if(reason === 'client namespace disconnect' || reason === 'transport error' || reason === 'transport close') {
            
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
