const { Users } = require('../../database/models');

const removeUser = async (userId) => {
    try {
        console.log('remove user', userId)
        let result = await Users.remove({_id: userId});
        return true;
    } catch (err) {
        console.log(err)
        return false
    }
}

module.exports = removeUser;