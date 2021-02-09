const { Bans } = require("../../database/models");
const ipInt = require('ip-to-int');

const getBans = async (req, res, next) => {
  try {
    let user = req.userData;
    if(user.role === 'admin' || user.role === 'super_admin') {
        let bans = await Bans.find({});
        bans = bans.map(({_id, username, room, ip, fromIp, toIp}) => {
            let realIp = null, realStartIp = null, realEndIp = null;
            if(ip)
                realIp = ipInt(ip).toIP();
            if(fromIp) {
                realEndIp = ipInt(fromIp).toIP();
            }
            if(toIp) {
                realEndIp = ipInt(toIp).toIP();
            }
            return {_id, username, room, ip: realIp, fromIp: realStartIp, toIp: realEndIp};
        })
        res
        .status(200)
        .json({ data: bans });
    } else {

    }
    
  } catch (err) {
    next(err);
  }
};

module.exports = getBans;
