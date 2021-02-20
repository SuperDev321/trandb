const { Rooms, Users } = require('../database/models');
const { getRoomPermission, findUserByName, banByUser, banByNameAndIp, checkBan, findRoomUsers } = require("../utils");
const {addBlock, removeBlock, getUserIp, getRoomBlocks, checkBlock} = require('../utils');
const kickUser = (io, socket) => async ({room, to}) => {
    console.log('kick')
    try {
        const { _id } = socket.decoded;
        const role = getRoomPermission(room, _id);
        const userToKick = await findUserByName(to);
        if(role) {
            await Rooms.updateOne({ name: room }, { $pull: { users: {_id: userToKick._id} } });
            console.log(userToKick._id)
            let socketIds = await io.of('/').in(userToKick._id.toString()).allSockets();
            let it = socketIds.values();
            let first = it.next();
            let id = first.value;
            let socketToKick = io.sockets.sockets.get(id);
            io.to(room).emit('kicked user', {
                room,
                kickedUserName: to
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
        if(!role)
            role = await getRoomPermission(room, _id);
        const userToBan = await findUserByName(to);
        if(role) {
            let res = null;
            let userIp = await getUserIp(room, userToBan._id);
            console.log('user ip', userIp);
            if(role === 'admin' && ip) {
                res = await banByNameAndIp(room, to, ip);
            } else {
                res = await banByUser(room, to, userIp);
            }
            
            if(res) {
                if(room) {
                    await Rooms.updateOne({ name: room }, { $pull: { users: {_id: userToBan._id} } });
                    let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
                    let it = socketIds.values();
                    let first = it.next();
                    let id = first.value;
                    let socketToBan = io.sockets.sockets.get(id);
                    io.to(room).emit('banned user', {
                        room,
                        kickedUserName: to
                    });
                    if(socketToBan) {
                        socketToBan.leave(room);
                    }
                } else {
                    await Rooms.updateMany({}, { $pull: { users: {_id: userToBan._id} } });
                    let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
                    let it = socketIds.values();
                    let first = it.next();
                    let id = first.value;
                    let socketToBan = io.sockets.sockets.get(id);
                    io.emit('global banned user', {
                        kickedUserName: to
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
    console.log('banUserByAdmin')
    try {
        const { _id } = socket.decoded;
        const userToBan = await findUserByName(to);
        console.log('msg ban', room, ip, to)
        let res = await banByNameAndIp(room , to, ip, fromIp, toIp);
        if(res) {
            await Rooms.updateOne({ name: room }, { $pull: { users: {_id: userToBan._id} } });
            let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
            let it = socketIds.values();
            let first = it.next();
            let id = first.value;
            let socketToBan = io.sockets.sockets.get(id);
            console.log('kick user', socketToBan);
            if(socketToBan) {
                socketToBan.leave(room);
            }
            io.to(room).emit('banned user', {
                room,
                kickedUserName: to
            });
            
        }
    } catch(err) {
        console.log(err)
        socket.emit('ban error');
    }
}

const blockUser = (io, socket) => async ({room, username}, callback) => {
    const {_id} = socket.decoded;
    const myRole = await getRoomPermission(room, _id);
    if(myRole === 'admin' || myRole === 'owner' || myRole === 'moderator') {
        let userToBlock = await findUserByName(username);
        let userIp = await getUserIp(room, userToBlock._id);
        let result = await addBlock(room, userToBlock.username, userIp);
        if(result) {
            const usersInfo = await findRoomUsers(room, myRole);
            let onlineUsers = await Promise.all(usersInfo.map(async ({username, ip, role, gender}) => {
                let item = {};
                let blocked = await checkBlock(room, username, ip);
                item.blocked = blocked;
                // if(myRole === 'admin' || myRole === 'super-admin') {
                    item.ip = ip;
                // }
                item.username = username;
                item.role = role;
                item.gender = gender;
                return item;
            }));
            const blocks = await getRoomBlocks(room);
            io.to(room).emit('update block', {room, onlineUsers, blocks}); 
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
    const myRole = await getRoomPermission(room, _id);
    if(myRole === 'admin' || myRole === 'owner' || myRole === 'moderator') {
        console.log('unblock', username, myRole)
        let userToBlock = await findUserByName(username);
        let userIp = await getUserIp(room, userToBlock._id);
        let result = await removeBlock(room, userToBlock.username, userIp);
        if(result) {
            const usersInfo = await findRoomUsers(room, myRole);
            let onlineUsers = await Promise.all(usersInfo.map(async ({username, ip, role, gender}) => {
                let item = {};
                let blocked = await checkBlock(room, username, ip);
                item.blocked = blocked;
                // if(myRole === 'admin' || myRole === 'super-admin') {
                    item.ip = ip;
                // }
                item.username = username;
                item.role = role;
                item.gender = gender;
                return item;
            }));
            const blocks = await getRoomBlocks(room);
            io.to(room).emit('update block', {room, onlineUsers, blocks}); 
            callback(true);
        } else {
            callback(false, 'Can not unblock this user')
        }

    } else {
        callback(false, 'Permission denied')
    }
    

}
module.exports = { kickUser, banUser, banUserByAdmin, blockUser, unBlockUser };
