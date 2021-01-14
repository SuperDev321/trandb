const { Chats } = require('../database/models');
const { findRoomUsers, findUserByName } = require('../utils');

const publicMessage = (io) => async ({ msg, room, from, color, bold }) => {
  try {
    const date = Date.now();
    
    const newChat = await Chats.create({
      msg,
      type: 'public',
      from,
      room,
      color,
      bold,
      date,
    });
    
    io.to(room).emit('room messages', [
      {
        type: 'public',
        room,
        _id: newChat._id,
        msg: newChat.msg,
        from: newChat.from,
        date: newChat.date,
        color: newChat.color,
        bold: newChat.bold
      },
    ]);
    console.log('color', newChat.color);
  } catch (err) {
    console.log(err);
  }
};

const privateMessage = (io, socket) => async ({ msg, room, from, to, color, bold }) => {
  console.log('private')
  try {
    const date = Date.now();
    
    const newChat = await Chats.create({
      msg,
      type: 'private',
      from,
      to,
      room,
      date,
      color,
      bold
    });

    const toUser = await findUserByName(to);
    console.log('private', toUser._id)
    
    io.to(toUser._id).emit('room messages', [
      {
        type: 'private',
        room,
        _id: newChat._id,
        msg: newChat.msg,
        from: newChat.from,
        to: newChat.to,
        color: newChat.color,
        bold: newChat.bold,
        date: newChat.date,
      },
    ]);

    socket.emit('room messages', [
      {
        type: 'private',
        room,
        _id: newChat._id,
        msg: newChat.msg,
        from: newChat.from,
        to: newChat.to,
        date: newChat.date,
        color: newChat.color,
      }
    ])
    console.log(msg, room, from, newChat.msg)
  } catch (err) {
    console.log(err);
  }
};

module.exports = { publicMessage, privateMessage };
