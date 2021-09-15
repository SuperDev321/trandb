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
            // const socketIds = await io.of('/').in(targetUserId).allSockets();
            // const it = socketIds.values();
            // const first = it.next();
            // const id = first.value;
            // const targetSocket = io.sockets.sockets.get(id);
            // if (targetSocket) {
            //     targetSocket.emit('check camera state', { room, username: user.username, userId: user._id }, (result) => {
            //         if (result) {
            //             callback(true);
            //         } else {
            //             callback(false);
            //         }
            //     })
            // } else {
            //     callback(false);
            // }
            callback(true);
        }
    } catch (err) {
        console.log(err.message)
        callback(false)
    }
}

const viewRequest = (io, socket) => async ({
    roomName, userId, targetName
}, callback) => {
    const requestUser = await Users.findById(userId);
    const targetUser = await Users.findOne({ username: targetName });
    if (!targetUser || !requestUser) {
        return callback(false);
    }
    const { video } = targetUser;
    if (!video) {
        return callback(false);
    }
    const { blocks } = video;
    if (blocks && blocks.includes(requestUser.username)) {
        return callback(false);
    }
    let socketIds = await io.of('/').in(targetUser._id.toString()).allSockets();
    let it = socketIds.values();
    let first = it.next();
    let id = first.value;
    let targetSocket = io.sockets.sockets.get(id);
    if(targetSocket) {
        targetSocket.emit('view request', {
            roomName,
            username: requestUser.username,
        }, (result) => {
            if(!result) {
                blocks.push(requestUser.username);
                targetUser.save();
            }
            if (callback) callback(result);
        });
    } else {
        return callback(false)
    }
}

const startView = (io, socket) => async ({ room_id, name, targetName }) => {
    const requestUser = await Users.findOne({ username: name });
    const targetUser = await Users.findOne({ username: targetName });
    if (!targetUser || !requestUser) {
        return;
    }
    let socketIds = await io.of('/').in(targetUser._id.toString()).allSockets();
    let it = socketIds.values();
    let first = it.next();
    let id = first.value;
    let targetSocket = io.sockets.sockets.get(id);
    if(targetSocket) {
        targetSocket.emit('start view', {
            room_id,
            name
        });
    }
}

const stopView = (io, socket) => async ({ room_id, name, targetName }) => {
    const requestUser = await Users.findOne({ username: name });
    const targetUser = await Users.findOne({ username: targetName });
    if (!targetUser || !requestUser) {
        return;
    }
    let socketIds = await io.of('/').in(targetUser._id.toString()).allSockets();
    let it = socketIds.values();
    let first = it.next();
    let id = first.value;
    let targetSocket = io.sockets.sockets.get(id);
    if(targetSocket) {
        targetSocket.emit('stop view', {
            room_id,
            name
        });
    }
}

const stopBroadcastTo = (io, socket) => async ({ room_id, name, targetName }) => {
    const requestUser = await Users.findOne({ username: name });
    const targetUser = await Users.findOne({ username: targetName });
    if (!targetUser || !requestUser) {
        return;
    }
    let socketIds = await io.of('/').in(targetUser._id.toString()).allSockets();
    let it = socketIds.values();
    let first = it.next();
    let id = first.value;
    let targetSocket = io.sockets.sockets.get(id);
    if(targetSocket) {
        targetSocket.emit('stop view from', {
            room_id,
            name
        });
    }
}

const consumerClosed = (io, socket) => async ({ consumer_id, room_id, userId }) => {
    console.log('consumer closed');
}

module.exports = { startVideo, stopVideo, isAvailableToBroadcast, isAvailableToView,
    consumerClosed, viewRequest, startView, stopView, stopBroadcastTo
};