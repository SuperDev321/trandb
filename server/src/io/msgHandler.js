const { Chats } = require('../database/models');
const { findRoomUsers, findUserByName, isForbidden, hasFobiddenWord, getIp, banByUser, banByNameAndIp, findUserById, checkBlockById } = require('../utils');
const {banUserByAdmin, banUser} = require('./userHandler');
const ipInt = require('ip-to-int');
const publicMessage = (io, socket) => async ({ msg, room, from, color, bold, type, messageType }, callback) => {
  try {
    const { _id } = socket.decoded;
    const date = Date.now();
    let user = await findUserById(_id);
    if(!user) {
      return callback(false);
    }
    let userIp = user.ip? ipInt(user.ip).toIP(): null;
    if(messageType !== 'image') {
      let isForbiddenMessage = await hasFobiddenWord(msg);
      if(isForbiddenMessage) {
        await banUser(io, socket)({ip: userIp, to: user.username, role: 'admin'});
        return callback(false);
      }
    }
    let isBlocked = await checkBlockById(room, _id);
    if(isBlocked) {
      return callback(false, 'blocked');
    }
    const newChat = await Chats.create({
      msg,
      type: 'public',
      messageType,
      from,
      ip: userIp,
      room,
      color,
      bold,
      date,
    });
    callback(newChat);
    socket.to(room).emit('room message', {
        type: 'public',
        room,
        _id: newChat._id,
        msg: newChat.msg,
        from: newChat.from,
        date: newChat.date,
        color: newChat.color,
        bold: newChat.bold,
        ip: newChat.ip,
        messageType: newChat.messageType
    });
  } catch (err) {
    console.log(err);
  }
};

const pokeMessage = (io, socket) => async ({from, to, room, pokeType}, callback) => {
  const toUser = await findUserByName(to);
  const { _id } = socket.decoded;
  let user = await findUserById(_id);
  if(!user) {
    return callback(false);
  }
  let userIp = user.ip? ipInt(user.ip).toIP(): null;
  let isBlocked = await checkBlockById(room, _id);
    if(isBlocked) {
      return callback(false, 'blocked');
    }
  if(toUser) {
    const socketIds = await io.of('/').in(room).allSockets();
    const socketIdArr = Array.from(socketIds);
    if(socketIdArr.length < 2) {
      callback(false, 'logout');
      socket.leave(room);
      return;
    }
    let socketToPoke = null;
    for (let index = 0; index < socketIdArr.length; index++) {
      const element = socketIdArr[index];
      let socket = io.sockets.sockets.get(element);
      if(toUser._id.equals(socket.decoded._id)) {
        socketToPoke = socket;
      }
    }
    if (socketToPoke) {
      socketToPoke.emit('poke message', {
        type: 'poke',
        room,
        from,
        to,
        pokeType,
        ip: userIp
      }, (res) => {
        if (res) {
          console.log('poke success')
          return callback('success')
        } else {
          console.log('poke fail')
          return callback('muted')
        }
      });
    } else {
      return callback('Can not find user')
    }
  } else {
    return callback('Can not find user')
  }
}

const privateMessage = (io, socket) => async ({ roomName, msg, from, to, color, bold, messageType }, callback) => {
  try {
    const { _id } = socket.decoded;
    const date = Date.now();
    let isBlocked = await checkBlockById(null, _id);
    if(isBlocked) {
      return callback(false, 'blocked');
    }
    let user = await findUserById(_id);
    let userIp = user.ip? ipInt(user.ip).toIP(): null;
    if(messageType !== 'image') {
      let isForbiddenMessage = await hasFobiddenWord(msg);
      if(isForbiddenMessage) {
        await banUser(io, socket)({ip: userIp, to: user.username, role: 'admin'});
        return callback(false, 'forbidden');
      }
    }
    
    const newChat = await Chats.create({
      msg,
      messageType,
      type: 'private',
      from,
      to,
      date,
      color,
      bold,
      ip: userIp
    });
    const toUser = await findUserByName(to);
    if(toUser) {
      let socketIds = await io.of('/').in(roomName).allSockets();
      const socketIdArr = Array.from(socketIds);
      if(socketIdArr.length < 2) {
        callback(false, 'logout');
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
            messageType: newChat.messageType,
            _id: newChat._id,
            msg: newChat.msg,
            from: newChat.from,
            to: newChat.to,
            color: newChat.color,
            bold: newChat.bold,
            date: newChat.date,
            roomName,
            ip: newChat.ip
          }, (res) => {
            if(res === 'success') {
              callback(newChat)
            } else if(res === 'muted') {
              callback(false, 'muted')
            }
              
        });
      } else {
        callback(false, 'logout');
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
