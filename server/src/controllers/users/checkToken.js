const { verifyToken } = require('../../utils');
const { Users } = require('../../database/models');

const checkToken = async (req, res, next) => {
  try {
    const {token} = req.body;
    const { _id } = await verifyToken(token);
    const { username, role, gender, avatarObj, currentAvatar, point } = await Users.findOne({ _id });
    return res.json({ _id, username, role, gender, avatarObj, currentAvatar, point });
  } catch (err) {
    // if (err.message === 'jwt must be provided')
    return res.send('un-auth');
    return next(err);
  }
};

module.exports = checkToken;
