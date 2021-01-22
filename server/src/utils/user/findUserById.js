const { Users } = require('../../database/models');

const findUserById = async (_id) => {
  const user = await Users.findOne({ _id });
  return user;
};

module.exports = findUserById;