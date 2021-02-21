const { findUserById } = require('../../utils');

const getUserByName = async (req, res, next) => {
    try {
        const {userId} = req.params;
        if(username) {
            let {_id, username, avatar, gender} = await findUserById(userId);
            return res.status(200).json({_id, username, avatar, gender});
        }
    } catch (err) {
        return next(err);
    }
    
}

module.exports = getUserByName;