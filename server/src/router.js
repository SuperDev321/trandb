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
  deleteRoom,
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
  deleteModerator,
  getWords,
  addWord,
  deleteWord,
  getSetting,
  updateSetting
} = require('./controllers');
const getUserIp = require('./controllers/users/getUserIp');

const { withAuth, withIp } = require('./middleware');
const isAdmin = require('./middleware/isAdmin');

const router = express.Router();

router.get('/checkToken', checkToken);
router.get('/logout', withAuth, logout);

router.get('/setting', getSetting);
router.post('/setting', isAdmin ,updateSetting);

router.get('/rooms', getRooms);
router.post('/room', withAuth, addRoom);
router.put('/room/general', withAuth, updateRoomGeneral);
router.put('/room/media', withAuth, updateRoomMedia);
router.get('/rooms/:roomName', withAuth, getRoomDetail);
router.get('/rooms/:roomName/isPrivate', checkRoomPermission);
router.delete('/rooms/:id', isAdmin ,deleteRoom);
router.post('/signup', signup);
router.post('/login', withIp, login);
router.post('/login/guest', withIp, guestLogin);
router.post('/login/google', googleLogin);

router.post('/messages/private', getPrivateChat);

router.get('/user/:username', getUserByName);
router.get('/users/:userId/rooms', withAuth, getUserRooms);
router.get('/users/:userId', getUserDetail);
router.get('/users/:username/ip', withAuth, isAdmin, getUserIp);

router.delete('/bans/:banId', withAuth, deleteBan);
router.post('/bans', withAuth, addBan);
router.get('/bans', withAuth, getBans);

router.get('/forbiddenWords', getWords);
router.post('/forbiddenWords', withAuth, isAdmin ,addWord);
router.delete('/forbiddenWords/:id', deleteWord);

router.post('/moderators', withAuth, addModerator)
router.post('/moderators/delete', withAuth, deleteModerator)

router.get('/admin/rooms', getRoomsAdmin);

router.post('/file_upload', fileUploader)

router.use(clientError);
router.use(serverError);

module.exports = router;
