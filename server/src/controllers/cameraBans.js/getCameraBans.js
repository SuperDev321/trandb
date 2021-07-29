const { Bans } = require("../../database/models");
const ipInt = require('ip-to-int');

const getCameraBans = async (req, res, next) => {
  try {
    // let user = req.userData;
    role = 'admin'
    if(role === 'admin' || role === 'super_admin') {
        let bans = await Bans.find({});
        res
        .status(200)
        .json({ data: bans });
    } else {

    }
    
  } catch (err) {
    next(err);
  }
};

module.exports = getCameraBans;
