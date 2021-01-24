const { Rooms, Users } = require('../database/models');
const { getRoomPermission, findUserByName, banByName, banByNameAndIp, checkBan } = require("../utils");
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

const banUser = (io, socket) => async ({room , ip, fromIp, toIp, to}) => {
    try {
        const { _id } = socket.decoded;
        const role = await getRoomPermission(room, _id);
        const userToBan = await findUserByName(to);
        if(role) {
            let res = null;
            console.log(role)
            if(role === 'admin' && (ip || (fromIp && toIp))) {
                res = await banByNameAndIp(room, to, ip, fromIp, toIp);
                console.log('admin ban', res)
            } else {
                res = await banByName(room, to);
            }
            
            if(res) {
                if(room) {
                    await Rooms.updateOne({ name: room }, { $pull: { users: {_id: userToBan._id} } });
                    console.log('room update', room, userToBan)
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
                    console.log('room update', userToBan)
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
    
    try {
        const { _id } = socket.decoded;
        const userToBan = await findUserByName(to);
        let res = await banByNameAndIp(room , ip, fromIp, toIp, to);
        if(res) {
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
        }
    } catch(err) {
        console.log(err)
        socket.emit('ban error');
    }
}

module.exports = { kickUser, banUser, banUserByAdmin };
