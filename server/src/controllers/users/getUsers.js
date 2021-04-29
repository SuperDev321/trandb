const { Users } = require('../../database/models');

const getUsers = async (req, res, next) => {
    try {
        const users = await Users.find({});
        const usersInfo = users.map(({_id, username, role}) => ({_id, username, role}))
        return res.status(200).json({
            users: usersInfo
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
    
}

module.exports = getUsers;