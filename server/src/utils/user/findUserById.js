const { Users } = require('../../database/models');

const findUserById = async (_id) => {
  const user = await Users.findOne({ _id });
  console.log(user)
  return user;
};

module.exports = findUserById;