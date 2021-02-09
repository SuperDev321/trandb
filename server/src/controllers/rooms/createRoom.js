const { validateRoomName, isNewRoom, createRoom } = require('../../utils');
const formidable = require('formidable');
const { Rooms } = require('../../database/models');
const path = require('path');
var randomString = require('random-string')

function getFileName(prefix, filename) {
  var ext = path.extname(filename)
  var newFileName = randomString({
    length: 8,
    numeric: true,
    letters: true,
    special: false
  });
  newFileName += ext
  return prefix + newFileName;
}

const addRoom = async (req, res, next) => {
  try {
    const { name, category, description, welcomeMessage, password, maxUsers} = req.body;
    console.log(description, welcomeMessage, password);
    const user = req.userData;
    let user_id = user._id;
    let role = user.role;
    await validateRoomName(name);
    await isNewRoom(name);

    await createRoom({ name, owner: user_id, category, description, welcomeMessage, password, maxUsers }, role);
    let upload = {cover: null, icon: null};
    if(req.files) {
      let coverImage = req.files.cover;
      console.log('ok')
      if(coverImage) {
        let newCoverFileName = getFileName("icon_", coverImage.name);
        console.log('ok', newCoverFileName, coverImage);
        let r_upload = await coverImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/img/rooms/',newCoverFileName));
        console.log(r_upload)
        let r_save_icon = await Rooms.updateOne({name}, {cover: newCoverFileName});
        // let photo_url = "img/rooms/" + newCoverFileName;
        upload.cover = true;
      }
      let iconImage = req.files.icon;
      if(iconImage) {
        let newIconFileName = getFileName("icon_", iconImage.name);
        let r_upload = await iconImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'build/img/rooms/', newIconFileName));
        let r_save_icon = await Rooms.updateOne({name}, {icon: newIconFileName});
        // let photo_url = "img/rooms/" + newIconFileName;
        upload.icon = true;
      }
    }
    res
      .status(201)
      .json({ statusCode: 201, message: 'room has been created successfully' });
    
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = addRoom;
