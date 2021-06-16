const ipToInt = require('ip-to-int');
const { Rooms, Users } = require('../database/models');
const { getRoomPermission, findUserByName, banByUser, banByNameAndIp, checkBan, findRoomUsers, getBlocks, getGlobalBlocks, getGlobalBlocksWithIp } = require("../utils");
const {addBlock, removeBlock, removeBlockAdmin, getUserIp, getRoomBlocks, checkBlock} = require('../utils');
const kickUser = (io, socket) => async ({room, to}) => {
    try {
        const { _id } = socket.decoded;
        const {role, username} = await getRoomPermission(room, _id);
        const userToKick = await findUserByName(to);
        if(role && username) {
            await Rooms.updateOne({ name: room }, { $pull: { users: userToKick._id} });
            let socketIds = await io.of('/').in(userToKick._id.toString()).allSockets();
            let it = socketIds.values();
            let first = it.next();
            let id = first.value;
            let socketToKick = io.sockets.sockets.get(id);
            io.to(room).emit('kicked user', {
                room,
                kickedUserName: to,
                role,
                username
            });
            if(socketToKick) {
                socketToKick.leave(room);
            }
        }
    } catch(err) {
        console.log(err)
        socket.emit('kick error');
    }
}

const banUser = (io, socket) => async ({room , ip, to, role}) => {
    try {
        const { _id } = socket.decoded;
        const userData = await getRoomPermission(room, _id);
        if(!role) {
            role = userData.role;
        }
        const userToBan = await findUserByName(to);
        if(role) {
            let res = null;
            let userIp = userToBan.ip? ipToInt(userToBan.ip).toIP(): null;
            if(role === 'admin' && ip) {
                res = await banByNameAndIp(room, to, ip);
            } else {
                res = await banByUser(room, to, userIp);
            }
            
            if(res) {
                if(room) {
                    await Rooms.updateOne({ name: room }, { $pull: { users: userToBan._id} });
                    let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
                    let it = socketIds.values();
                    let first = it.next();
                    let id = first.value;
                    let socketToBan = io.sockets.sockets.get(id);
                    io.to(room).emit('banned user', {
                        room,
                        kickedUserName: to,
                        role,
                        username: userData.username // admin or moderator's name
                    });
                    if(socketToBan) {
                        socketToBan.leave(room);
                    }
                } else {
                    await Rooms.updateMany({}, { $pull: { users: userToBan._id }});
                    let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
                    let it = socketIds.values();
                    let first = it.next();
                    let id = first.value;
                    let socketToBan = io.sockets.sockets.get(id);
                    io.emit('global banned user', {
                        kickedUserName: to,
                        role,
                        username: userData.username // admin or moderator's name
                    });
                    if(socketToBan) {
                        const rooms = [...socketToBan.rooms];
                        for (let index = 2; index < rooms.length; index++) {
                            const room = rooms[index];
                            socketToBan.leave(room);
                        }
                    }
                }
            }
        }
    } catch(err) {
        console.log(err)
        socket.emit('ban error');
    }
}

const banUserByAdmin = (io, socket) => async ({ room , ip, fromIp, toIp, to}) => {
    try {
        const { _id } = socket.decoded;
        const userData = await getRoomPermission(room, _id);
        const userToBan = await findUserByName(to);
        let res = await banByNameAndIp(room , to, ip, fromIp, toIp);
        if(res) {
            await Rooms.updateOne({ name: room }, { $pull: { users: userToBan._id } });
            let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
            let it = socketIds.values();
            let first = it.next();
            let id = first.value;
            let socketToBan = io.sockets.sockets.get(id);
            if(socketToBan) {
                socketToBan.leave(room);
            }
            io.to(room).emit('banned user', {
                room,
                kickedUserName: to,
                role: 'admin',
                username: userData.username
            });
            
        }
    } catch(err) {
        console.log(err)
        socket.emit('ban error');
    }
}

const blockUser = (io, socket) => async ({room, username}, callback) => {
    const {_id, role} = socket.decoded;
    const {role: myRole, username: blockingUsername} = await getRoomPermission(room, _id);
    if(myRole === 'super_admin' || myRole === 'admin' || myRole === 'owner' || myRole === 'moderator') {
        let userToBlock = await findUserByName(username);
        let userIp = ipToInt(userToBlock.ip).toIP();
        let result = await addBlock(room, userToBlock.username, userIp, myRole);
        if(result) {
            if(myRole === 'admin' || myRole === 'super_admin') {
                const blocks = await getGlobalBlocksWithIp();
                io.emit('update global block', {blocks});
            } else {
                const blocks = await getRoomBlocks(room);
                console.log('emit update block')
                io.to(room).emit('update block', {room, blocks});
            }
            callback(true);
        } else {
            callback(false, 'Can not block this user')
        }

    } else {
        callback(false, 'Permission denied')
    }
    

}

const unBlockUser = (io, socket) => async ({room, username}, callback) => {
    const {_id} = socket.decoded;
    const { role: myRole } = await getRoomPermission(room, _id);
    if(myRole === 'super_admin' || myRole === 'admin' || myRole === 'owner' || myRole === 'moderator') {
        console.log('unblock', username, myRole)
        let userToBlock = await findUserByName(username);
        let userIp = ipToInt(userToBlock.ip).toIP();
        try {
            if(myRole === 'admin' || myRole === 'super_admin') {
                let result = await removeBlockAdmin(userToBlock.username, userIp);
                if(!result) {
                    return callback(false, 'Can not unblock this user');
                }
                const globalBlocks = await getGlobalBlocksWithIp();
                const blocks = await getRoomBlocks(room);
                io.emit('update global block', {blocks: globalBlocks});
                io.to(room).emit('update block', {room, blocks});
            } else {
                let result = await removeBlock(room, userToBlock.username, userIp);
                if(!result) {
                    return callback(false, 'Can not unblock this user');
                }
                const blocks = await getRoomBlocks(room);
                console.log('emit update block')
                io.to(room).emit('update block', {room, blocks});
            }
            callback(true);
        } catch(err) {
            callback(false, 'Can not unblock this user')
        }

    } else {
        callback(false, 'Permission denied')
    }
    

}
module.exports = { kickUser, banUser, banUserByAdmin, blockUser, unBlockUser };
