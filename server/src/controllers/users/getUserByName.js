const { findUserByName } = require('../../utils');

const getUserByName = async (req, res, next) => {
    try {
        
        const {username} = req.params;
        if(username) {
            let {_id, avatar, gender, role} = await findUserByName(username);
            return res
            .status(200)
            .json({data: {_id, username, avatar, gender, role}});
        }
    } catch (err) {
        console.log(err)
        return next(err);
    }
    
}

module.exports = getUserByName;