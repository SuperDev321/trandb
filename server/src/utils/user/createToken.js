const signToken = require('./signToken');

const createToken = async (userId, userRole) => {
  const payload = {};
  payload._id = userId;
  payload.role = userRole;
  return signToken(payload);
};

module.exports = createToken;
