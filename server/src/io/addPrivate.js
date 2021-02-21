const { Rooms, Chats, Users } = require('../database/models');
const { findUserByName } = require('../utils');
var randomString = require('random-string')

const addPrivate = (io, socket) => async ({ from, to }, callback) => {
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
            console.log('find private')
            privateRoomName = privateRoom;
            return callback(privateRoom);
        } else {
            console.log('not find private')
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
                console.log('add private callback', newPrivateRoomName)
                return callback(newPrivateRoomName);
            } else {
                return callback(null)
            }
        }
        
        
        
    } catch (err) {
        console.log(err);
        callback(null);
    }
};

module.exports = addPrivate;
