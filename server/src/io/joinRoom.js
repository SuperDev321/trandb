const { Rooms, Chats, Users } = require('../database/models');
const { findRoomUsers, checkBan } = require('../utils');

const joinRoom = (io, socket) => async ({ room }) => {
    try {
        const { _id } = socket.decoded;
        // console.log(socket.rooms);
        // console.log('joining room:', room, _id);
        
        
        // console.log(io)

        let user = await Users.findOne({_id});
        let isBan = await checkBan(room, user.username);
        if(isBan) {
            socket.emit('join error', 'You are banned from this room.');
            return;
        }
        await Rooms.updateOne({ name: room }, { $addToSet: { users: [{_id, ip: null}] } });
        
        socket.join(room);
        let {welcomeMessage} = await Rooms.findOne({name: room});
        const messages = await Chats.find({ room, type: 'public' });
        const usersInfo = await findRoomUsers(room);

        socket.emit('init room', {messages, onlineUsers: usersInfo, room: {name: room, welcomeMessage}}, (data)=> {
            if(data === 'success') {
                io.to(room).emit('joined room', {room, onlineUsers: usersInfo, joinedUser: user});
            }
        });

        
    } catch (err) {
        console.log(err);
        socket.emit('join error', 'You cannot join to this room');
    }
};

module.exports = joinRoom;
