const { Chats } = require('../database/models');
const { findRoomUsers, findUserByName } = require('../utils');

const publicMessage = (io, socket) => async ({ msg, room, from, color, bold }) => {
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
    
    socket.to(room).emit('room message', {
        type: 'public',
        room,
        _id: newChat._id,
        msg: newChat.msg,
        from: newChat.from,
        date: newChat.date,
        color: newChat.color,
        bold: newChat.bold
    });
    console.log('color', newChat.color);
  } catch (err) {
    console.log(err);
  }
};

const pokeMessage = (io, socket) => async ({from, to, room}, callback) => {
  const toUser = await findUserByName(to);
  console.log('poke message', from, to, toUser)
  if(toUser) {
    io.to(toUser._id.toString()).emit('poke message', {
      type: 'poke',
      room,
      from,
      to
    });
    callback('success');
  } else {
    callback('Can not find user')
  }
}

const privateMessage = (io, socket) => async ({ roomName, msg, from, to, color, bold }, fn) => {
  console.log('private')
  try {
    const date = Date.now();
    
    const newChat = await Chats.create({
      msg,
      type: 'private',
      from,
      to,
      date,
      color,
      bold
    });

    const toUser = await findUserByName(to);
    console.log('private', toUser._id, roomName)
    if(toUser) {
      let socketIds = await io.of('/').in(roomName).allSockets();
      console.log(socketIds)
      socketIdArr = Array.from(socketIds);
      if(socketIdArr.length < 2) {
        console.log('other leaved');
        fn(false);
        socket.leave(roomName);
        return;
      }
      let socketToPrivate = null;
      for (let index = 0; index < socketIdArr.length; index++) {
        const element = socketIdArr[index];
        let socket = io.sockets.sockets.get(element);
        if(toUser._id.equals(socket.decoded._id)) {
          socketToPrivate = socket;
        }
      }
      // let it = socketIds.values();
      // let first = it.next();
      // let id = first.value;
      // let socketToPrivate = io.sockets.sockets.get(id);
      if(socketToPrivate) {
        socketToPrivate.emit('room message',
          {
            type: 'private',
            _id: newChat._id,
            msg: newChat.msg,
            from: newChat.from,
            to: newChat.to,
            color: newChat.color,
            bold: newChat.bold,
            date: newChat.date,
            roomName
          }, (res) => {
            if(res)
              fn(newChat);
        });
      } else {
        console.log('no user to receive private')
        fn(false);
      }
    }
    

    // socket.emit('room messages', [
    //   {
    //     type: 'private',
    //     room,
    //     _id: newChat._id,
    //     msg: newChat.msg,
    //     from: newChat.from,
    //     to: newChat.to,
    //     date: newChat.date,
    //     color: newChat.color,
    //   }
    // ])
  } catch (err) {
    console.log(err);
  }
};

module.exports = { publicMessage, privateMessage, pokeMessage };
