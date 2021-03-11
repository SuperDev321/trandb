const { Users } = require('../../database/models');
const createError = require('../createError');

const getUserByNickname = async (username) => {
  const user = await Users.findOne({ username });

  if (!user)
    return null;
  return user;
};

module.exports = getUserByNickname;
