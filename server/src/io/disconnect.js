const { Rooms, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');
const LogManager = require('../constructors/logManager');
const ipInt = require('ip-to-int');

const disconnectingList = new Set();

const disconnectUser = async (_id, name, rooms, io, socket) => {
    console.log('disconnect')
    for (let index = 0; index < rooms.length; index++) {
        const room = rooms[index];
        if(room) {
            await Users.updateOne({_id}, { isInChat: false, video: null });
            await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
            const usersInfo = await findRoomUsers(room);
            io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
            socket.leave(room);
        }
    }
}

const disconnectSocket = async (io, socket, reason) => {
    try {
        const rooms = [...socket.rooms];
        
        // socket.rooms returns an object where key and value are the same
        // first key is socket id, second key is rooms name
        const { _id } = socket.decoded;
        let user = await Users.findOne({_id});
        if (!user) {
            return;
        }
        console.log(reason)
        if (disconnectingList.has(user.name) || reason === 'client namespace disconnect') {
            disconnectUser(_id, user.name, rooms, io, socket);
            LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect', reason);
            disconnectingList.delete(user.name);
        } else {
            disconnectingList.add(user.name);
            const timer = setTimeout(async () => {
                console.log('disconnect timeout');
                if (disconnectingList.has(user.name)) {
                    disconnectUser(_id, user.name, rooms, io, socket);
                    LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect', reason);
                    disconnectingList.delete(user.name);
                }
                clearTimeout(timer);
            }, [2000])
        }

        // for (let index = 0; index < rooms.length; index++) {
        //     const room = rooms[index];
        //     if(room) {
        //         if (disconnectingList.has(user.name)) {
        //             await Users.updateOne({_id}, { isInChat: false, video: null });
        //             await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
        //             const usersInfo = await findRoomUsers(room);
        //             io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
        //             disconnectingList.delete(user.name);
        //         } else {
        //             disconnectingList.add(user.name);
        //             const timer = setTimeout(async () => {
        //                 if (disconnectingList.has(user.name)) {
        //                     await Users.updateOne({ _id }, { isInChat: false, video: null });
        //                     await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
        //                     const usersInfo = await findRoomUsers(room);
        //                     io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
        //                     disconnectingList.delete(user.name);
        //                 }
        //                 clearTimeout(timer);
        //             }, [2000])
        //         }
        //         socket.leave(room);
        //     }
        // }
        // LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect', reason);
    } catch (err) {
        console.log(err);
    }
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
            disconnectSocket(io, socket, reason);
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

module.exports = { socketDisconnect, disconnectingList };
