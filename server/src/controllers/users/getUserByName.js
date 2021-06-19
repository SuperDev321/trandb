const { findUserByName } = require('../../utils');

const getUserByName = async (req, res, next) => {
    try {
        
        const {username} = req.params;
        if(username) {
            const {_id, avatar, gender, role, avatarObj, currentAvatar} = await findUserByName(username);
            return res
            .status(200)
            .json({_id, username, avatar, gender, role, avatarObj, currentAvatar});
        }
    } catch (err) {
        console.log(err)
        return next(err);
    }
    
}

module.exports = getUserByName;