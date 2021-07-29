const { CameraBans } = require('../../database/models');
const { getRoomPermission } = require('../../utils');


const deleteCameraBan = async (req, res, next) => {
  let user = req.userData;
  try {
    const {banId} = req.params;
    if(banId) {
      if(user.role ===  'admin' || user.role === 'super_admin') {
        await CameraBans.findOneAndDelete({ _id: banId });
        res
        .status(204)
        .send({});
        return;
      } else {
        let {room} = await CameraBans.findById(banId);
        if(room) {
          const {role} = await getRoomPermission(room, user._id);
          if(role === 'owner') {
            await CameraBans.deleteOne({ _id: banId });
            res
            .status(204)
            .send({});
            return;
          }
        }
      }
      res
      .status(403)
      .send({error: 'Permission error'});
    } else {
        res
        .status(404)
        .send({error: 'Can not find ban'});
    }
    
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = deleteCameraBan;