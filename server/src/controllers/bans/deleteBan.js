const { Bans } = require('../../database/models');


const deleteBan = async (req, res, next) => {
    console.log('delte ban')
  try {
    const {banId} = req.params;
    if(banId) {
        await Bans.findOneAndDelete({ _id: banId });
        res
        .status(204)
        .send({});
    } else {
        res
        .status(404)
        .send({error: 'Can not find ban'});
    }
    
  } catch (err) {
    next(err);
  }
};

module.exports = deleteBan;