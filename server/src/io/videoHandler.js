const { Users } = require('../database/models');
const { findRoomUsers, findUserByName, checkCameraBan } = require('../utils');

const startVideo = (io, socket) => async ({ room, producers, locked }) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        if (user) {
            await Users.updateOne({ _id }, {
                video: {
                    room,
                    producers,
                    locked
                }
            });
            io.to(room).emit('start video', {
                room,
                producers,
                userId: user._id,
                locked,
                username: user.username
            });
        }
        
    } catch (err) {
      console.log(err);
    }
};

const stopVideo = (io, socket) => async ({ room }) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        if (user) {
            await Users.updateOne({ _id }, {
                video: null
            });
            io.to(room).emit('stop video', {
                room,
                userId: user._id,
                username: user.username
            });
        }
    } catch (err) {
      console.log(err);
    }
};

const isAvailableToBroadcast = (io, socket) => async ({ room }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        const result = await checkCameraBan(room, user.username, user.ip);
        if (result && !result.isBan) {
            callback(true);
        } else {
            callback(false);
        }
    } catch (err) {
        callback(false)
    }
}

const isAvailableToView = (io, socket) => async ({ room, targetUserId }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        const result = await checkCameraBan(room, user.username, user.ip);
        if (result && result.isBan) {
            callback(false);
        } else {
            const socketIds = await io.of('/').in(targetUserId).allSockets();
            const it = socketIds.values();
            const first = it.next();
            const id = first.value;
            const targetSocket = io.sockets.sockets.get(id);
            
            if (targetSocket) {
                targetSocket.emit('check camera state', { room, username: user.username, userId: user._id }, (result) => {
                    if (result) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                })
            } else {
                callback(false);
            }
        }
    } catch (err) {
        callback(false)
    }
}

module.exports = { startVideo, stopVideo, isAvailableToBroadcast, isAvailableToView };