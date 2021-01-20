const { Rooms, Chats, Users } = require('../database/models');
const { findRoomUsers } = require('../utils');

const joinRoom = (io, socket) => async ({ room }) => {
    try {
        const { _id } = socket.decoded;
        // console.log(socket.rooms);
        // console.log('joining room:', room, _id);
        socket.join(room);
        // console.log(io)
        let user = await Users.findOne({_id});
        await Rooms.updateOne({ name: room }, { $addToSet: { users: [_id] } });

        const messages = await Chats.find({ room, type: 'public' });
        const usersInfo = await findRoomUsers(room);

        socket.emit('init room', {messages, onlineUsers: usersInfo, room}, (data)=> {
            if(data === 'success') {
                io.to(room).emit('joined room', {room, onlineUsers: usersInfo, joinedUser: user});
            }
        });

        
    } catch (err) {
        console.log(err);
    }
};

module.exports = joinRoom;
