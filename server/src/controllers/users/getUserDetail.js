const { findUserById } = require('../../utils');

const getUserById = async (req, res, next) => {
    try {
        const {userId} = req.params;
        if(username) {
            let {_id, username, avatarObj, currentAvatar, avatar, gender} = await findUserById(userId);
            return res.status(200).json({_id, username, avatar, gender, avatarObj, currentAvatar});
        }
    } catch (err) {
        return next(err);
    }
    
}

module.exports = getUserById;