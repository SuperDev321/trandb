const { findUserByName } = require('../../utils');

const getUser = async (req, res, next) => {
    try {
        const username = req.params.username;
        if(username) {
            let {_id, username, avatar, gender,} = await findUserByName(username);
            return req.json({_id, username, avatar, gender});
        }
    } catch (err) {
        return next(err);
    }
    
}

module.exports = getUser;