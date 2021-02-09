const { Rooms, Chats, Users } = require('../database/models');
const { findRoomUsers, checkBan } = require('../utils');

const joinRoom = (io, socket) => async ({ room }) => {
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
        let {welcomeMessage} = await Rooms.findOne({name: room});
        const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
        const usersInfo = await findRoomUsers(room, user.role);
        socket.emit('init room', {messages, onlineUsers: usersInfo, room: {name: room, welcomeMessage}}, (data)=> {
            if(data === 'success') {
                io.to(room).emit('joined room', {room, onlineUsers: usersInfo,
                    joinedUser: {
                        _id: user._id,
                        username: user.username,
                        role: user.role,
                        gender: user.gender,
                        ip
                    }});
            }
        });

        
    } catch (err) {
        console.log(err);
        socket.emit('join error', 'You cannot join to this room');
    }
};

module.exports = joinRoom;
