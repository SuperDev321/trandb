const { Users } = require('../../database/models');

const removeUser = async (userId) => {
    try {
        let result = await Users.remove({_id: userId});
        return true;
    } catch (err) {
        return false
    }
}

module.exports = removeUser;