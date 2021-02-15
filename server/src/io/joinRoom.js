const { Rooms, Chats, Users } = require('../database/models');
const { findRoomUsers, checkBan, getRoomBlocks, getGlobalBlocks, checkBlock } = require('../utils');

const joinRoom = (io, socket) => async ({ room, password }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        let ip = socket.handshake.address;
        if (ip.substr(0, 7) === '::ffff:') {
            ip = ip.substr(7);
        }
        // console.log(socket.rooms);
        // console.log('joining room:', room, _id);
        // console.log(io)
        let roomInfo = await Rooms.findOne({name: room});
        if(roomInfo.password && roomInfo.password !== '') {
            if(password !== roomInfo.password) {
                return callback(false, 'Wrong password');
            }
        }
        let user = await Users.findOne({_id});
        let isBan = await checkBan(room, user.username, ip);
        if(isBan) {
            return callback(false, 'You are banned from this room.')
        }
        await Rooms.updateOne({ name: room }, { $addToSet: { users: [{_id, ip}] } });
        
        socket.join(room);
        callback(true)
        
        const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
        const usersInfo = await findRoomUsers(room, user.role);
        let onlineUsers = await Promise.all(usersInfo.map(async ({username, ip, role, gender}) => {
            let item = {};
            let blocked = await checkBlock(room, username, ip);
            item.blocked = blocked;
            // if(user.role === 'admin' || user.role === 'super-admin') {
                item.ip = ip;
            // }
            item.username = username;
            item.role = role;
            item.gender = gender;
            return item;
        }));
        console.log(onlineUsers)

        const blocks = await getRoomBlocks(room);
        let blocked = await checkBlock(room, user.username, ip);
        socket.emit('init room',
            {messages, onlineUsers, room: {name: room, welcomeMessage: roomInfo.welcomeMessage}, blocks},
            (data)=> {
                if(data === 'success') {
                    
                    io.to(room).emit('joined room', {room, onlineUsers: usersInfo,
                        joinedUser: {
                            _id: user._id,
                            username: user.username,
                            role: user.role,
                            gender: user.gender,
                            ip,
                            blocked
                        }
                    });
                }
            }
        );

        
    } catch (err) {
        console.log(err);
        socket.emit('join error', 'You cannot join to this room');
    }
};

const rejoinRoom = (io, socket) => async ({ room }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        let ip = socket.handshake.address;
        if (ip.substr(0, 7) === '::ffff:') {
            ip = ip.substr(7);
        }
        // console.log(socket.rooms);
        // console.log('joining room:', room, _id);
        // console.log(io)

        let user = await Users.findOne({_id});
        let isBan = await checkBan(room, user.username, ip);
        if(isBan) {
            socket.emit('join error', 'You are banned from this room.');
            return;
        }
        await Rooms.updateOne({ name: room }, { $addToSet: { users: [{_id, ip}] } });
        
        socket.join(room);
        // let {welcomeMessage} = await Rooms.findOne({name: room});
        // const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
        const usersInfo = await findRoomUsers(room, user.role);
        // socket.emit('init room', {messages, onlineUsers: usersInfo, room: {name: room, welcomeMessage}}, (data)=> {
            // if(data === 'success') {
                // io.to(room).emit('joined room', {room, onlineUsers: usersInfo,
                //     joinedUser: {
                //         _id: user._id,
                //         username: user.username,
                //         role: user.role,
                //         gender: user.gender,
                //         ip
                //     }});
            // }
        // });
        callback(true);
        
    } catch (err) {
        console.log(err);
        callback(false)
    }
};
module.exports = {joinRoom, rejoinRoom};
