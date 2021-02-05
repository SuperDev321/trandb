const express = require('express');

const {
  clientError,
  serverError,
  signup,
  login,
  guestLogin,
  googleLogin,
  checkToken,
  logout,
  getRoomDetail,
  getRooms,
  addRoom,
  getPrivateChat,
  getUserByName,
  getUserDetail,
  deleteBan,
  getUserRooms,
} = require('./controllers');

const { withAuth } = require('./middleware');

const router = express.Router();

router.get('/checkToken', checkToken);
router.get('/logout', logout);
router.get('/rooms', getRooms);
router.post('/room', withAuth, addRoom);
router.get('/rooms/:roomName', withAuth, getRoomDetail);
router.post('/signup', signup);
router.post('/login', login);
router.post('/login/guest', guestLogin);
router.post('/login/google', googleLogin);

router.post('/messages/private', getPrivateChat);

router.get('/user/:username', getUserByName);
router.get('/users/:userId/rooms', withAuth, getUserRooms);
router.get('/users/:userId', getUserDetail);

router.delete('/bans/:banId', deleteBan)

router.use(clientError);
router.use(serverError);

module.exports = router;
