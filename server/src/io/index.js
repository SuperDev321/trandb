const {joinRoom, rejoinRoom} = require('./joinRoom');
const leaveRoom = require('./leaveRoom');
const addPrivate = require('./addPrivate');
const leavePrivate = require('./leavePrivate');
const { publicMessage, privateMessage, pokeMessage } = require('./msgHandler');
const { kickUser, banUser, banUserByAdmin, blockUser, unBlockUser, unBanCamera } = require('./userHandler');
const { startVideo, stopVideo, isAvailableToBroadcast, isAvailableToView } = require('./videoHandler');
const socketDisconnect = require('./disconnect');
const { sendGift } = require('./gift')
const { Users } = require('../database/models');
const LogManager = require('../constructors/logManager');
const { verifyToken, findUserById, initSetting } = require('../utils');
const socketIO = require('socket.io');
// const {
//   createRoom, getProducers, getRouterRtpCapabilities,
//   createWebRtcTransport, connectTransport, produce, consume, resume,
//   producerClosed, roomProducersClosed, joinMedia, createMediaRoom,
//   startView, stopView, viewRequest, stopBroadcastTo
// } = require('./mediasoup.js');

const ipInt = require('ip-to-int');
const isIp = require('is-ip');

let io = null



const ioHandler = (io) => async (socket) => {
  let socketIds = await io.of('/').in(socket.decoded._id).allSockets();
  if(socketIds.size === 0) {
    socket.join(socket.decoded._id);
  } else {
    socket.emit('repeat connection');
    return;
  }
  const isMobile = socket.handshake.query.ismobile;
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
  let result = await Users.updateOne({_id: socket.decoded._id}, {ip: ipInt(ip).toInt(), isInChat: true, isMobile});
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
    socket.on('unban camera', unBanCamera(io, socket));
    socket.on('send gift', sendGift(io, socket));
    
    // video events
    socket.on('start video', startVideo(io, socket));
    socket.on('stop video', stopVideo(io, socket));
    socket.on('check camera broadcast', isAvailableToBroadcast(io, socket));
    socket.on('check camera view', isAvailableToView(io, socket));

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

const initIO = (server) => {
  io = socketIO(server, {
    pingInterval: 25000,
    pingTimeout: 60000 * 3,
    upgradeTimeout: 30000,
    agent: false,
    reconnectionDelay: 1000,
    reconnectDelayMax: 5000,
  });
  io.use(async (socket, next) => {
    try {
      // const token = (socket.request.headers.cookie + ';').match(/(?<=token=)(.*?)(?=;)/)[0];
      // await rateLimiter.consume(socket.handshake.address)
      token = socket.handshake.query.token;
      // const token = cookies.token
      const decoded = await verifyToken(token);
      // eslint-disable-next-line no-param-reassign
      socket.decoded = decoded;
      next();
    } catch (err) {
        console.log(err)
        next(new Error('Authentication error'));
    }
  }).on('connection', ioHandler(io));
}

const getIO = () => {
  return io;
}

module.exports = {ioHandler, adminIoHandler, io, initIO, getIO};
