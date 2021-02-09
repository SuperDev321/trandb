const { verifyToken } = require('../../utils');
const { Users } = require('../../database/models');

const checkToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const { _id } = await verifyToken(token);
    const { username, role, gender, avatar } = await Users.findOne({ _id });
    console.log('checked', username)
    return res.json({ username, role, gender, avatar });
  } catch (err) {
    if (err.message === 'jwt must be provided') return res.send('un-auth');
    return next(err);
  }
};

module.exports = checkToken;
