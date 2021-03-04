const {joinRoom, rejoinRoom} = require('./joinRoom');
const leaveRoom = require('./leaveRoom');
const addPrivate = require('./addPrivate');
const leavePrivate = require('./leavePrivate');
const { publicMessage, privateMessage, pokeMessage } = require('./msgHandler');
const { kickUser, banUser, banUserByAdmin, blockUser, unBlockUser } = require('./userHandler');
const {sendSignal, returnSignal} = require('./videoHandler');
const socketDisconnect = require('./disconnect');
const { Users } = require('../database/models');
const LogManager = require('../constructors/logManager');
const ipInt = require('ip-to-int');
const isIp = require('is-ip')
const ioHandler = (io) => async (socket) => {

  let socketIds = await io.of('/').in(socket.decoded._id).allSockets();
  if(socketIds.size === 0) {
    console.log('connected', socket.decoded._id, socketIds);
    socket.join(socket.decoded._id);
  } else {
    socket.emit('repeat connection');
    return;
  }
  let ip = socket.client.request.headers['cf-connecting-ip'] || socket.client.request.headers['x-forwarded-for'] || socket.client.request.connection.remoteAddress
  if(isIp(ip)) {
      if(!isIp.v4(ip)) {
          var address = new Address6(ip);
          var teredo = address.inspectTeredo();
          ip = teredo.client4;
      }
      if (ip.substr(0, 7) === '::ffff:') {
          ip = ip.substr(7);
      }
  } else {
      ip = '0.0.0.0';
  }
  let user = await Users.findOne({_id: socket.decoded._id});
  if(!user) return;
  let result = await Users.updateOne({_id: socket.decoded._id}, {ip: ipInt(ip).toInt(),isInChat: true});
  LogManager.saveLogInfo(ip, user.username, user.role, 'Connect');

    socket.on('join room', joinRoom(io, socket));
    socket.on('rejoin room', rejoinRoom(io, socket));
    socket.on('leave room', leaveRoom(io, socket));

    // message events
    socket.on('public message', publicMessage(io, socket));
    socket.on('private message', privateMessage(io, socket));

    socket.on('open private', addPrivate(io, socket))
    socket.on('leave private', leavePrivate(socket))
    socket.on('poke message', pokeMessage(io, socket));
    socket.on('kick user', kickUser(io, socket));
    socket.on('ban user', banUser(io, socket));
    socket.on('block user', blockUser(io, socket));
    socket.on('unblock user', unBlockUser(io, socket));
    // video events
    socket.on('sending video signal', sendSignal(io));
    socket.on('returning video signal', returnSignal(io));

    socket.on('error', (err) => {
      console.log(err);
    });

    socket.on('disconnecting', socketDisconnect(io, socket));
    socket.on('disconnect', (reason) => {
      console.log(reason)
    })
};

const adminIoHandler = (io) => (socket) => {
    io.on('ban user', banUserByAdmin(io, socket));
}

module.exports = {ioHandler, adminIoHandler};
