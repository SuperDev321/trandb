const { Rooms } = require('../../database/models');
const path = require('path');
var randomString = require('random-string')

const updateRoomGeneral = async (req, res, next) => {
  try {
    const { _id, category, description, welcomeMessage, password, maxUsers} = req.body;
    console.log(description, welcomeMessage);
    const user = req.userData;
    let user_id = user._id;
    let role = user.role;
    let room = await Rooms.findById(_id);
    if(room && room.owner.equals(user_id) || role === 'admin') {
      await Rooms.updateOne({_id}, {category, description, welcomeMessage, password, maxUsers});
      res
      .status(202)
      .json({ message: 'room has been updated successfully' });
    } else {
      res
      .status(409)
      .json({error: {
        msg: 'Permission error'
      }})
    }

    
    
  } catch (err) {
    console.log(err)
    next(err);
  }
};

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

const updateRoomMedia = async (req, res, next) => {
  try {
    const {_id} = req.body;
    console.log(_id);
    const user = req.userData;
    let user_id = user._id;
    let role = user.role;
    let room = await Rooms.findById(_id);
    if(role!=='guest' && room && room.owner.equals(user_id)) {
      if(req.files) {
        let coverImage = req.files.cover;
        if(coverImage) {
          let newCoverFileName = getFileName("icon_", coverImage.name);
          let r_upload = await coverImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/img/rooms/',newCoverFileName));
          let r_save_icon = await Rooms.updateOne({_id}, {cover: newCoverFileName});
          // let photo_url = "img/rooms/" + newCoverFileName;
        }
        let iconImage = req.files.icon;
        if(iconImage) {
          let newIconFileName = getFileName("icon_", iconImage.name);
          let r_upload = await iconImage.mv(path.join(__dirname, '..', '..', '..', '..', 'client', 'public/img/rooms/', newIconFileName));
          let r_save_icon = await Rooms.updateOne({_id}, {icon: newIconFileName});
          // let photo_url = "img/rooms/" + newIconFileName;
        }
        res
        .status(204)
        .json({});
      
      } else {
        res
        .status(409)
        .json({error: {
          msg: 'no data to update'
        }})
      }
    } else {
      res
        .status(403)
        .json({error: {
          msg: 'You have no permission'
        }})
    }
  } catch(err) {
    console.log(err)
    next(err);
  }

}

module.exports = {updateRoomGeneral, updateRoomMedia};
