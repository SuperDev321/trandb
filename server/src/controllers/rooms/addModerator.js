const { Rooms, Users } = require('../../database/models');

const addModerator = async (req, res, next) => {
  try {
    let {roomId, username} = req.body;
    let userData = req.userData;
    let {_id, role} = await Users.findOne({username});
    let {owner} = await Rooms.findOne({_id: roomId});
    if(role === 'user' && owner.equals(userData._id)) {
        let {nModified} = await Rooms.updateOne({ _id: roomId }, { $addToSet: { moderators: [{_id}] } });
        if(nModified > 0) {
            res
                .status(200)
                .json({_id, username});
        }
        else {
            res
            .status(422)
            .json({ statusCode: 422, message: 'Already exits' });
        }
    } else{
        res
            .status(400)
            .json({ statusCode: 400, message: 'You can not add moderator' });
    }
    
  } catch (err) {
    // console.log(err)
    next(err);
  }
};

module.exports = addModerator;
