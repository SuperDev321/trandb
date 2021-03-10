const {
  validateLoginCredentials,
  getUserByNickname,
  checkPassword,
  createToken,
  updateIp,
} = require('../../utils');
const checkUserFromServer = require('../../utils/user/checkUserFromServer');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let ipAddress = req.userIp;
    await validateLoginCredentials({ username, password });

    let user = await checkUserFromServer(username, password);
    if(user) {
      console.log(user);
      // await checkPassword(password, user.password);
      // await updateIp(user._id, ipAddress);

      const token = await createToken(user._id, user.role);

      res
        .cookie('token', token)
        .status(200)
        .json({ statusCode: 200, message: 'logged in successfully' });
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = login;
