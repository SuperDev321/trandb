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
  getPublicChat,
  deleteChat,
  fileUploader,
  getUsers,
  updateProfile,
  updateAvatar,
  getUserByName,
  getUserDetail,
  getPublicRoomNames,
  getPrivateRoomNames,
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
  updateSetting,
  startBoot,
  stopBoot,
  addBoot,
  deleteBoot,
  getBoots,
  editBoot,
  addGift,
  deleteGift,
  updateGift,
  getGifts,
  initPoints
} = require('./controllers');
const getUserIp = require('./controllers/users/getUserIp');

const { withAuth, withIp } = require('./middleware');
const isAdmin = require('./middleware/isAdmin');

const router = express.Router();

router.post('/checkToken', checkToken);
router.get('/logout', withAuth, logout);

router.get('/setting', getSetting);
router.post('/setting', withAuth, isAdmin ,updateSetting);

router.get('/rooms', getRooms);
router.get('/room/names', getPublicRoomNames);
router.get('/room/names/private', getPrivateRoomNames);
router.post('/room', withAuth, addRoom);
router.put('/room/general', withAuth, updateRoomGeneral);
router.put('/room/media', withAuth, updateRoomMedia);
router.get('/rooms/:roomName', withAuth, getRoomDetail);
router.get('/rooms/:roomName/isPrivate', checkRoomPermission);
router.delete('/rooms/:id', withAuth, isAdmin ,deleteRoom);
router.post('/signup', signup);
router.post('/login', withIp, login);
router.post('/login/guest', withIp, guestLogin);
router.post('/login/google', googleLogin);
router.post('/users/init/point', initPoints);

router.post('/messages/private', withAuth, isAdmin, getPrivateChat);
router.get('/messages/public/:roomName', withAuth, isAdmin, getPublicChat);
router.delete('/messages/:id', withAuth, isAdmin, deleteChat);

router.get('/users', getUsers);
router.get('/user/:username', getUserByName);
router.get('/users/:userId/rooms', withAuth, getUserRooms);
router.get('/users/:userId', getUserDetail);
router.get('/users/:username/ip', withAuth, isAdmin, getUserIp);
router.post('/user/update/avatar', withAuth, updateAvatar)
router.post('/profile/update', updateProfile)

router.delete('/bans/:banId', withAuth, deleteBan);
router.post('/bans', withAuth, addBan);
router.get('/bans', withAuth, getBans);

router.get('/forbiddenWords', getWords);
router.post('/forbiddenWords', withAuth, isAdmin ,addWord);
router.delete('/forbiddenWords/:id', deleteWord);

router.post('/moderators', withAuth, addModerator)
router.post('/moderators/delete', withAuth, deleteModerator)

router.get('/admin/rooms', getRoomsAdmin);

router.post('/file_upload', fileUploader);

router.get('/boots', getBoots);
router.post('/boot', addBoot);
router.post('/boot/edit', editBoot);
router.post('/boot/start', startBoot);
router.post('/boot/stop', stopBoot);
router.delete('/boots/:id', deleteBoot);

router.get('/gifts', getGifts);
router.post('/gift', addGift);
router.delete('/gift/:id', deleteGift);
router.post('/gift/edit', updateGift);


router.use(clientError);
router.use(serverError);

module.exports = router;
