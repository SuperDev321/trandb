const { Users } = require('../../database/models');
const createError = require('../createError');

const getUserByNickname = async (username) => {
  const user = await Users.findOne({ username });

  if (!user)
    throw createError(
      400,
      'Bad Request',
      'an account with this email does not exist'
    );

  return user;
};

module.exports = getUserByNickname;
