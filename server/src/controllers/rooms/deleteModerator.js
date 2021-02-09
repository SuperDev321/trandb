const { Rooms } = require('../../database/models');


const deleteModerator = async (req, res, next) => {
    console.log('delte ban')
  try {
    const {roomId, moderatorId} = req.body;
    if(roomId && moderatorId) {
        let {nModified} = await Rooms.updateOne({ _id: roomId }, {$pull: {moderators: moderatorId}});
        if(nModified)
            res
                .status(204)
                .send({});
        else {
            res
                .status(404)
                .send({error: 'Can not find moderator'});
        }
    } else {
        res
        .status(404)
        .send({error: 'Bad request'});
    }
    
  } catch (err) {
    next(err);
  }
};

module.exports = deleteModerator;