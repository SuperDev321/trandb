const ipToInt = require('ip-to-int');
const { Rooms, Users } = require('../database/models');
const { getRoomPermission, findUserByName, banByUser, banByNameAndIp, checkBan,
    findRoomUsers, getBlocks, getGlobalBlocks,
    getGlobalBlocksWithIp, getRoomCameraBans, getGlobalCameraBans,
    addBlock, removeBlock, removeBlockAdmin, getUserIp,
    getRoomBlocks, cameraBanByUser, removeCameraBan
} = require('../utils');
const cameraBanByNameAndIp = require('../utils/cameraBan/cameraBanByNameAndIp');
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

const banUser = (io, socket) => async ({room , ip, to, role, reason, kind}) => {
    try {
        const { _id } = socket.decoded;
        let userData = null;
        if (room) {
            userData = await getRoomPermission(room, _id);
        } else {
            userData = {
                username: process.env.SUPER_ADMIN_NAME
            }
        }
        if(!role) {
            role = userData.role;
        }

        const userToBan = await findUserByName(to);
        if(role && kind === 'chat') {
            let res = null;
            let userIp = userToBan.ip? ipToInt(userToBan.ip).toIP(): null;
            if((role === 'super_admin' || role === 'admin') && ip) {
                res = await banByNameAndIp(room, to, ip, null, null, reason);
            } else {
                res = await banByUser(room, to, userIp, reason);
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
                        username: userData ? userData.username: null, // admin or moderator's name,
                        reason
                    });
                    if(socketToBan) {
                        socketToBan.leave(room);
                    }
                } else {
                    await Rooms.updateMany({ type: { $ne: 'private' } }, { $pull: { users: userToBan._id }});
                    let socketIds = await io.of('/').in(userToBan._id.toString()).allSockets();
                    let it = socketIds.values();
                    let first = it.next();
                    let id = first.value;
                    let socketToBan = io.sockets.sockets.get(id);
                    console.log('global ban')
                    io.emit('global banned user', {
                        kickedUserName: to,
                        role,
                        username: userData ? userData.username: null, // admin or moderator's name
                        reason
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
        if (role && kind === 'camera') {
            let res = null;
            const userIp = userToBan.ip? ipToInt(userToBan.ip).toIP(): null;
            if((role === 'super_admin' || role === 'admin') && ip) {
                res = await cameraBanByNameAndIp(room, to, ip);
            } else {
                res = await cameraBanByUser(room, to, userIp);
            }
            if (room) {
                const cameraBans = await getRoomCameraBans(room);
                io.to(room).emit('update camera bans', { room, cameraBans });
            } else {
                const globalCameraBans = await getGlobalCameraBans();
                io.emit('update global camera bans', { globalCameraBans });
            }
        }
    } catch(err) {
        console.log(err)
        socket.emit('ban error');
    }
}

const banUserByAdmin = (io, socket) => async ({ room , ip, fromIp, toIp, to, reason }) => {
    try {
        const { _id } = socket.decoded;
        let userData = null
        if (room) {
            userData = await getRoomPermission(room, _id);
        } else {
            userData = {
                username: process.env.SUPER_ADMIN_NAME
            }
        }
        
        const userToBan = await findUserByName(to);
        let res = await banByNameAndIp(room , to, ip, fromIp, toIp, reason);
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
                username: userData.username,
                reason
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

const unBanCamera = (io, socket) => async ({room, username}, callback) => {
    const {_id} = socket.decoded;
    const { role: myRole } = await getRoomPermission(room, _id);
    if(myRole === 'super_admin' || myRole === 'admin' || myRole === 'owner' || myRole === 'moderator') {
        let userToBlock = await findUserByName(username);
        console.log(userToBlock)
        let userIp = ipToInt(userToBlock.ip).toIP();
        console.log(userIp)
        try {
            if(myRole === 'admin' || myRole === 'super_admin') {
                let result = await removeCameraBan(null, userToBlock.username, userIp, true);
                if(!result) {
                    return callback(false, 'Can not unban this camera');
                }
                const globalCameraBans = await getGlobalCameraBans();
                const cameraBans = await getRoomCameraBans(room);
                io.emit('update global camera bans', {blocks: globalCameraBans});
                io.to(room).emit('update camera bans', {room, cameraBans});
            } else {
                let result = await removeCameraBan(room, userToBlock.username, userIp);
                if(!result) {
                    return callback(false, 'Can not unban this user');
                }
                const cameraBans = await getCameraBans(room);
                io.to(room).emit('update camera bans', {room, cameraBans});
            }
            callback(true);
        } catch(err) {
            console.log(err)
            callback(false, 'Can not unban this user')
        }

    } else {
        callback(false, 'Permission denied')
    }
}

module.exports = { kickUser, banUser, banUserByAdmin, blockUser, unBlockUser, unBanCamera };
