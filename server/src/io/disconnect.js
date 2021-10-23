const { Rooms, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');
const LogManager = require('../constructors/logManager');
const ipInt = require('ip-to-int');

const disconnectingList = new Set();

const disconnectUser = async (_id, name, rooms, io, socket) => {
    try {
        await Users.updateOne({_id}, { isInChat: false, video: null });
        for (let index = 0; index < rooms.length; index++) {
            const room = rooms[index];
            if(room) {
                await Rooms.updateOne({ name: room }, { $pull: { users: _id }});
                const usersInfo = await findRoomUsers(room);
                io.to(room).emit('leave room', {room, onlineUsers: usersInfo, leavedUser: _id});
                socket.leave(room);
            }
        }
        socket.disconnect();
        socket.removeAllListeners();
        socket = null; //this will kill all event listeners working with socket
    } catch (err) { console.log(err, _id, rooms, io, socket)}
}

const disconnectSocket = async (io, socket, reason) => {
    try {
        const rooms = [...socket.rooms];
        const ioTmp = io;
        const socketTmp = socket;
        // socket.rooms returns an object where key and value are the same
        // first key is socket id, second key is rooms name
        const { _id } = socket.decoded;
        let user = await Users.findOne({_id});
        if (!user) {
            return;
        }

        if (!disconnectingList.has(user.name) && (reason === 'client namespace disconnect' || reason === 'ping timeout')) {
            console.log('disconnect 1', reason, Boolean(io))
            disconnectingList.add(user.name);
            const timer = setTimeout(async () => {
                if (disconnectingList.has(user.name)) {
                    disconnectingList.delete(user.name);
                    await disconnectUser(_id, user.name, rooms, ioTmp, socketTmp);
                    LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect', reason);
                }
                clearTimeout(timer);
            }, [3000])
            
        } else {
            disconnectingList.delete(user.name);
            await disconnectUser(_id, user.name, rooms, io, socket);
            LogManager.saveLogInfo(ipInt(user.ip).toIP(), user.username, user.role, 'disconnect', reason);
        }
    } catch (err) {
        console.log(err);
    }
}

const socketDisconnect = (io, socket) => async (reason) => {
    try {
        console.log('disconnecting', reason)
        await disconnectSocket(io, socket, reason);
    } catch (err) {
        console.log(err);
    }
};

module.exports = { socketDisconnect, disconnectingList };
