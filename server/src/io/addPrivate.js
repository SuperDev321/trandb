const { Rooms, Chats, Users, Settings } = require('../database/models');
const { findUserByName, createPrivateRoom } = require('../utils');
var randomString = require('random-string')

const addPrivate = (io, socket) => async ({ from, to, role }, callback) => {
    try {
        let rooms = Array.from(socket.rooms);
        let privateRoom = rooms.find((item) => {
            let strArr = item.split('_');
            if(strArr.length === 4 && strArr[3] === 'private') {
                if((strArr[1] === from && strArr[2] === to) || (strArr[1] === to && strArr[2] === from)) {
                    return true;
                }
            }
            return false;
        });
        if(privateRoom) {
            privateRoomName = privateRoom;
            return callback(true, privateRoom);
        } else {
            if(role === 'guest') {
                let {allowPrivate} = await Settings.findOne({type: 'admin'});
                if(!allowPrivate) {
                    return callback(false, 'private_error_guest')
                }
            }
            createPrivateRoom(from, to)
            var newPrivateRoomName = randomString({
                length: 8,
                numeric: true,
                letters: true,
                special: false
            });
            // find other user's socket
            newPrivateRoomName += '_' + from + '_' + to + '_' + 'private';
            
            const toUser = await findUserByName(to);
            let socketIds = await io.of('/').in(toUser._id.toString()).allSockets();
            let it = socketIds.values();
            let first = it.next();
            let id = first.value;
            let socketToPrivate = io.sockets.sockets.get(id);
            if(socketToPrivate) {
                socketToPrivate.join(newPrivateRoomName);
                socket.join(newPrivateRoomName);
                return callback(true, newPrivateRoomName);
            } else {
                return callback(false)
            }
        }
    } catch (err) {
        console.log(err);
        callback(false, err.message);
    }
};

module.exports = addPrivate;
