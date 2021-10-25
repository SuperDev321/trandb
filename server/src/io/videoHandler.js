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
            if (callback) callback(true);
        } else {
            if (callback) callback(false);
        }
    } catch (err) {
        if (callback) callback(false)
    }
}

const isAvailableToView = (io, socket) => async ({ room, targetUserId }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        const result = await checkCameraBan(room, user.username, user.ip);
        console.log('camera ban result', result)
        if (result && result.isBan) {
            if (callback) callback(false);
        } else {
            if (callback) callback(true);
        }
    } catch (err) {
        console.log(err.message)
        callback(false)
    }
}

const viewRequest = (io, socket) => async ({
    roomName, userId, targetName
}, callback) => {
    try {
        const requestUser = await Users.findById(userId);
        const targetUser = await Users.findOne({ username: targetName });
        if (!targetUser || !requestUser) {
            if (callback) callback(false);
            return;
        }
        const { video } = targetUser;
        if (!video) {
            if (callback) callback(false);
            return;
        }
        const { blocks } = video;
        if (blocks && blocks.includes(requestUser.username)) {
            if (callback) callback(false);
            return;
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
            if (callback) callback(false);
            return;
        }
    } catch (err) {
        if (callback) callback(false);
    }
}

const startView = (io, socket) => async ({ room_id, name, targetName }) => {
    try {
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
    } catch(err) {
        console.log(err.message);
    }
}

const stopView = (io, socket) => async ({ room_id, name, targetName }) => {
    try {
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
    } catch (err) {
        console.log(err.message);
    }
}

const stopBroadcastTo = (io, socket) => async ({ room_id, name, targetName }) => {
    try {
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
    } catch (err) {
        console.log(err.message);
    }
}

const consumerClosed = (io, socket) => async ({ consumer_id, room_id, userId }) => {
    console.log('consumer closed');
}

module.exports = { startVideo, stopVideo, isAvailableToBroadcast, isAvailableToView,
    consumerClosed, viewRequest, startView, stopView, stopBroadcastTo
};
