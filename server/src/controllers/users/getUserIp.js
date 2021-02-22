const { findUserById, getIp, findUserByName } = require('../../utils');

const getUserIp = async (req, res, next) => {
    try {
        const {username} = req.params;
        let ip = await getIp(username);
        return res.status(200).json(ip);
    } catch (err) {
        console.log(err)
        return next(err);
    }
    
}

module.exports = getUserIp;