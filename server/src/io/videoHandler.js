const { Users } = require('../database/models');
const { findRoomUsers, findUserByName } = require('../utils');

const startVideo = (io, socket) => async ({ room, producers, locked }) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        if (user) {
            await Users.updateOne({ _id }, {
                video: {
                    room,
                    producers,
                    locked
                }
            });
            io.to(room).emit('start video', {
                room,
                producers,
                userId: user._id,
                locked,
                username: user.username
            });
        }
        
    } catch (err) {
      console.log(err);
    }
};

const stopVideo = (io, socket) => async ({ room }) => {
    try {
        const { _id, role } = socket.decoded;
        const user = await Users.findById(_id);
        if (user) {
            await Users.updateOne({ _id }, {
                video: null
            });
            io.to(room).emit('stop video', {
                room,
                userId: user._id,
                username: user.username
            });
        }
    } catch (err) {
      console.log(err);
    }
};

module.exports = { startVideo, stopVideo };