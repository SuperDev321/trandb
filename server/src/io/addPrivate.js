const { Rooms, Chats, Users } = require('../database/models');
const { findUserByName } = require('../utils');
var randomString = require('random-string')

const addPrivate = (io, socket) => async ({ from, to }, callback) => {
    try {
        var newPrivateRoomName = randomString({
            length: 8,
            numeric: true,
            letters: true,
            special: false
        });
        newPrivateRoomName += from + to;
        console.log('private',to)
        const toUser = await findUserByName(to);
        let socketIds = await io.of('/').in(toUser._id.toString()).allSockets();
        let it = socketIds.values();
        let first = it.next();
        let id = first.value;
        let socketToPrivate = io.sockets.sockets.get(id);
        if(socketToPrivate) {
            socketToPrivate.join(newPrivateRoomName);
            socket.join(newPrivateRoomName);
            console.log('add private callback', newPrivateRoomName)
            callback(newPrivateRoomName);
        } else {
            callback(null)
        }
    } catch (err) {
        console.log(err);
        callback(null);
    }
};

module.exports = addPrivate;
