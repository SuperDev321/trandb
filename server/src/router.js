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
  checkRoomPermission,
  getRooms,
  getRoomsAdmin,
  addRoom,
  updateRoomGeneral,
  updateRoomMedia,
  getPrivateChat,
  fileUploader,
  getUserByName,
  getUserDetail,
  addBan,
  deleteBan,
  getBans,
  getUserRooms,
  addModerator,
  deleteModerator
} = require('./controllers');

const { withAuth } = require('./middleware');
const isAdmin = require('./middleware/isAdmin');

const router = express.Router();

router.get('/checkToken', checkToken);
router.get('/logout', logout);
router.get('/rooms', getRooms);
router.post('/room', withAuth, addRoom);
router.put('/room/general', withAuth, updateRoomGeneral);
router.put('/room/media', withAuth, updateRoomMedia);
router.get('/rooms/:roomName', withAuth, getRoomDetail);
router.get('/rooms/:roomName/isPrivate', checkRoomPermission);
router.post('/signup', signup);
router.post('/login', login);
router.post('/login/guest', guestLogin);
router.post('/login/google', googleLogin);

router.post('/messages/private', getPrivateChat);

router.get('/user/:username', getUserByName);
router.get('/users/:userId/rooms', withAuth, getUserRooms);
router.get('/users/:userId', getUserDetail);

router.delete('/bans/:banId', withAuth, deleteBan);
router.post('/bans', addBan);
router.get('/bans', getBans);

router.post('/moderators', withAuth, addModerator)
router.post('/moderators/delete', withAuth, deleteModerator)

router.get('/admin/rooms', getRoomsAdmin);

router.post('/file_upload', fileUploader)

router.use(clientError);
router.use(serverError);

module.exports = router;
